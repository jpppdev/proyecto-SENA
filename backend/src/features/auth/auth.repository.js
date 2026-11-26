// backend/src/features/auth/auth.repository.js
import { pool } from "../../config/db.js";

export const authRepository = {
  async findByEmail(userEmail) {
    const cleanEmail = String(userEmail || "").trim();

    try {
      const query = `
        SELECT
          u.id_usuario AS id,
          u.user_name,
          u.user_email,
          u.user_password,
          u.is_active,
          u.is_superuser AS "isSuperUser",
          COALESCE(
            r.nombre_rol,
            CASE
              WHEN u.is_superuser = TRUE THEN 'administrador'
              WHEN u.is_staff = TRUE THEN 'empleado'
              ELSE 'usuario'
            END
          ) AS "roleName"
        FROM usuarios u
        LEFT JOIN roles r ON u.id_rol = r.id_rol
        WHERE LOWER(TRIM(u.user_email)) = LOWER(TRIM($1))
           OR LOWER(TRIM(COALESCE(u.business_email, ''))) = LOWER(TRIM($1))
        LIMIT 1;
      `;
      const result = await pool.query(query, [cleanEmail]);
      if (result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Si la tabla usuarios no tiene la columna business_email o id_rol (código 42703)
      if (err.code === "42703") {
        const simpleQuery = `
          SELECT
            id_usuario AS id,
            user_name,
            user_email,
            user_password,
            is_active,
            is_superuser AS "isSuperUser",
            CASE
              WHEN is_superuser = TRUE THEN 'administrador'
              WHEN is_staff = TRUE THEN 'empleado'
              ELSE 'usuario'
            END AS "roleName"
          FROM usuarios
          WHERE LOWER(TRIM(user_email)) = LOWER(TRIM($1))
          LIMIT 1;
        `;
        const result = await pool.query(simpleQuery, [cleanEmail]);
        if (result.rows[0]) {
          return result.rows[0];
        }
      } else if (err.code !== "42P01") {
        throw err;
      }
    }

    // Respaldo en caso de que el registro exista en la tabla 'users'
    try {
      const legacyQuery = `
        SELECT id, user_name, user_email, COALESCE(user_password, password) AS user_password, is_active
        FROM users
        WHERE LOWER(TRIM(user_email)) = LOWER(TRIM($1))
        LIMIT 1;
      `;
      const legacyResult = await pool.query(legacyQuery, [cleanEmail]);
      return legacyResult.rows[0];
    } catch {
      return undefined;
    }
  },

  async ensureResetTokensTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id_token SERIAL PRIMARY KEY,
        user_email VARCHAR(150) NOT NULL,
        token VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async saveResetToken(userEmail, token, expiresAt) {
    await this.ensureResetTokensTable();
    const cleanEmail = String(userEmail || "").trim().toLowerCase();

    // Invalidamos tokens anteriores del mismo correo
    await pool.query(
      `UPDATE password_reset_tokens SET used = TRUE WHERE LOWER(TRIM(user_email)) = $1 AND used = FALSE;`,
      [cleanEmail]
    );

    const result = await pool.query(
      `INSERT INTO password_reset_tokens (user_email, token, expires_at, used)
       VALUES ($1, $2, $3, FALSE)
       RETURNING id_token, user_email, token, expires_at;`,
      [cleanEmail, String(token).trim(), expiresAt]
    );

    return result.rows[0];
  },

  async findValidResetToken(userEmail, token) {
    await this.ensureResetTokensTable();
    const cleanEmail = String(userEmail || "").trim().toLowerCase();
    const cleanToken = String(token || "").trim();

    const query = cleanEmail
      ? `
        SELECT id_token, user_email, token, expires_at
        FROM password_reset_tokens
        WHERE LOWER(TRIM(user_email)) = $1
          AND TRIM(token) = $2
          AND used = FALSE
          AND expires_at > CURRENT_TIMESTAMP
        ORDER BY created_at DESC
        LIMIT 1;
      `
      : `
        SELECT id_token, user_email, token, expires_at
        FROM password_reset_tokens
        WHERE TRIM(token) = $1
          AND used = FALSE
          AND expires_at > CURRENT_TIMESTAMP
        ORDER BY created_at DESC
        LIMIT 1;
      `;

    const values = cleanEmail ? [cleanEmail, cleanToken] : [cleanToken];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async markTokenAsUsed(idToken) {
    await pool.query(
      `UPDATE password_reset_tokens SET used = TRUE WHERE id_token = $1;`,
      [idToken]
    );
  },

  async updatePasswordByEmail(userEmail, hashedPassword) {
    const cleanEmail = String(userEmail || "").trim();

    try {
      const result = await pool.query(
        `UPDATE usuarios
         SET user_password = $1
         WHERE LOWER(TRIM(user_email)) = LOWER(TRIM($2))
            OR LOWER(TRIM(COALESCE(business_email, ''))) = LOWER(TRIM($2))
         RETURNING id_usuario AS id, user_email;`,
        [hashedPassword, cleanEmail]
      );
      if (result.rows[0]) return result.rows[0];
    } catch (err) {
      if (err.code === "42703") {
        const result = await pool.query(
          `UPDATE usuarios
           SET user_password = $1
           WHERE LOWER(TRIM(user_email)) = LOWER(TRIM($2))
           RETURNING id_usuario AS id, user_email;`,
          [hashedPassword, cleanEmail]
        );
        if (result.rows[0]) return result.rows[0];
      } else {
        throw err;
      }
    }

    return null;
  },
};