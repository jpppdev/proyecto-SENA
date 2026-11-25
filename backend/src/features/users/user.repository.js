// Importamos el pool de conexion a PostgreSQL
// Este pool es una instancia compartida configurada en la capa infraestructura.

import { pool } from "../../config/db.js";

//Exportamos el repositorio de usuarios
// EL repository encapsula todas las consultas SQL relacionadas con users.
export const userRepository = {

    // Metodo encargado de crear un usuario en la base de datos.
    // Recibe un objeto con los datos ya validados y procesador por el service.
    async create(userData) {

        // Desestructuramos explicitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes

        const {
            userName,
            userLastName = "",
            userEmail,
            businessEmail = null,
            userPhone,
            userDocumentTypes,
            userDocumentNumber,
            address = null,
            role = "empleado",
            startDate = null,
            endDate = null,
            userPassword,
            userAvatarUrl = null,
            isStaff = false,
            isActive = true,
            isSuperuser = false,
            isSuperUser = false,
        } = userData;

        const normalizedRole =
            role === "admin" || role === "administrador"
                ? "administrador"
                : role === "employee" || role === "empleado"
                ? "empleado"
                : role;

        const isAdmin = normalizedRole === "administrador" || Boolean(isSuperuser || isSuperUser);
        const staffFlag = isAdmin || normalizedRole !== "usuario" || Boolean(isStaff);

        try {
            // Intentamos insertar con el esquema completo de 0003_create_users_table.sql
            const roleRes = await pool.query(
                `SELECT id_rol FROM roles WHERE nombre_rol = $1 LIMIT 1`,
                [normalizedRole]
            );
            const idRol = roleRes.rows[0]?.id_rol || 1;

            const fullQuery = `
            INSERT INTO usuarios (
                id_rol,
                user_name,
                user_lastname,
                user_email,
                business_email,
                user_phone,
                user_document_types,
                user_document_number,
                address,
                user_password,
                user_avatar_url,
                is_staff,
                is_active,
                is_superuser
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
            ) RETURNING id_usuario AS id;
            `;

            const fullValues = [
                idRol,
                userName,
                userLastName || "",
                userEmail,
                businessEmail || null,
                userPhone,
                userDocumentTypes,
                userDocumentNumber,
                address || null,
                userPassword,
                userAvatarUrl || null,
                staffFlag,
                Boolean(isActive),
                isAdmin,
            ];

            const result = await pool.query(fullQuery, fullValues);
            const createdUser = result.rows[0];

            if (startDate && createdUser?.id) {
                try {
                    await pool.query(
                        `INSERT INTO contratos_laborales (id_usuario, start_date, end_date, estado_vinculo)
                         VALUES ($1, $2, $3, 'Activo')`,
                        [createdUser.id, startDate, endDate || null]
                    );
                } catch {
                    // Ignorar si contratos_laborales no existe en este entorno
                }
            }

            return createdUser;
        } catch (err) {
            // Si la tabla usuarios tiene el esquema simplificado sin id_rol/user_lastname (42703)
            if (err.code === "42703" || err.code === "42P01") {
                const simpleQuery = `
                INSERT INTO usuarios (
                    user_name,
                    user_email,
                    user_phone,
                    user_document_types,
                    user_document_number,
                    user_password,
                    user_avatar_url,
                    is_staff,
                    is_active,
                    is_superuser
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
                ) RETURNING id_usuario AS id;
                `;

                const simpleValues = [
                    userName,
                    userEmail,
                    userPhone,
                    userDocumentTypes,
                    userDocumentNumber,
                    userPassword,
                    userAvatarUrl || null,
                    staffFlag,
                    Boolean(isActive),
                    isAdmin,
                ];

                const result = await pool.query(simpleQuery, simpleValues);
                return result.rows[0];
            }
            throw err;
        }
    },

    async getAll() {
        try {
            const fullQuery = `
              SELECT 
                u.id_usuario AS id, 
                u.user_name AS "userName", 
                COALESCE(u.user_lastname, '') AS "userLastName",
                u.user_email AS "userEmail", 
                u.business_email AS "businessEmail",
                u.user_phone AS "userPhone", 
                u.user_document_types AS "userDocumentTypes",
                u.user_document_types AS "userDocumentType",
                u.user_document_number AS "userDocumentNumber",
                u.address,
                COALESCE(r.nombre_rol, CASE WHEN u.is_superuser THEN 'administrador' ELSE 'empleado' END) AS role,
                u.user_avatar_url AS "userImage",
                u.is_staff AS "isStaff",
                u.is_active,
                u.is_active AS "isActive",
                u.is_superuser AS "isSuperUser"
              FROM usuarios u
              LEFT JOIN roles r ON u.id_rol = r.id_rol
              ORDER BY u.id_usuario DESC;
            `;
            const result = await pool.query(fullQuery);
            return result.rows;
        } catch {
            const simpleQuery = `
              SELECT 
                id_usuario AS id, 
                user_name AS "userName", 
                user_email AS "userEmail", 
                user_phone AS "userPhone", 
                user_document_types AS "userDocumentTypes",
                user_document_types AS "userDocumentType",
                user_document_number AS "userDocumentNumber",
                is_staff AS "isStaff",
                is_active,
                is_active AS "isActive",
                is_superuser AS "isSuperUser"
              FROM usuarios 
              ORDER BY id_usuario DESC;
            `;
            const result = await pool.query(simpleQuery);
            return result.rows;
        }
    },

    async getById(id) {
        try {
            const fullQuery = `
              SELECT 
                u.id_usuario AS id, 
                u.user_name AS "userName", 
                COALESCE(u.user_lastname, '') AS "userLastName",
                u.user_email AS "userEmail", 
                u.business_email AS "businessEmail",
                u.user_phone AS "userPhone",
                u.user_document_types AS "userDocumentTypes",
                u.user_document_types AS "userDocumentType",
                u.user_document_number AS "userDocumentNumber",
                u.address,
                COALESCE(r.nombre_rol, CASE WHEN u.is_superuser THEN 'administrador' ELSE 'empleado' END) AS role,
                TO_CHAR(c.start_date, 'YYYY-MM-DD') AS "startDate",
                TO_CHAR(c.end_date, 'YYYY-MM-DD') AS "endDate",
                TO_CHAR(c.start_date, 'YYYY-MM-DD') AS "workStartDate",
                TO_CHAR(c.end_date, 'YYYY-MM-DD') AS "workEndDate",
                u.user_avatar_url AS "userImage",
                u.is_staff AS "isStaff",
                u.is_active,
                u.is_active AS "isActive",
                u.is_superuser AS "isSuperUser"
              FROM usuarios u
              LEFT JOIN roles r ON u.id_rol = r.id_rol
              LEFT JOIN contratos_laborales c ON u.id_usuario = c.id_usuario
              WHERE u.id_usuario = $1
              LIMIT 1;
            `;
            const result = await pool.query(fullQuery, [id]);
            return result.rows[0];
        } catch {
            const simpleQuery = `
              SELECT 
                id_usuario AS id, 
                user_name AS "userName", 
                user_email AS "userEmail", 
                user_phone AS "userPhone",
                user_document_types AS "userDocumentTypes",
                user_document_types AS "userDocumentType",
                user_document_number AS "userDocumentNumber",
                user_avatar_url AS "userImage",
                is_staff AS "isStaff",
                is_active,
                is_active AS "isActive",
                is_superuser AS "isSuperUser"
              FROM usuarios 
              WHERE id_usuario = $1;
            `;
            const result = await pool.query(simpleQuery, [id]);
            return result.rows[0];
        }
    },

    async update(id, userData) {
        const {
            userName,
            userLastName = "",
            userEmail,
            businessEmail = null,
            userPhone,
            userDocumentTypes,
            userDocumentNumber,
            address = null,
            role = "empleado",
            startDate = null,
            endDate = null,
            userPassword,
            isActive = true,
        } = userData;

        const normalizedRole =
            role === "admin" || role === "administrador"
                ? "administrador"
                : role === "employee" || role === "empleado"
                ? "empleado"
                : role;

        const isAdmin = normalizedRole === "administrador";
        const staffFlag = isAdmin || normalizedRole !== "usuario";
        const activeBool = isActive === "true" ? true : isActive === "false" ? false : Boolean(isActive);

        try {
            const roleRes = await pool.query(
                `SELECT id_rol FROM roles WHERE nombre_rol = $1 LIMIT 1`,
                [normalizedRole]
            );
            const idRol = roleRes.rows[0]?.id_rol || 1;

            const hasPassword = userPassword && String(userPassword).trim().length > 0;
            const fullQuery = hasPassword
                ? `
                  UPDATE usuarios SET
                    id_rol = $1,
                    user_name = $2,
                    user_lastname = $3,
                    user_email = $4,
                    business_email = $5,
                    user_phone = $6,
                    user_document_types = $7,
                    user_document_number = $8,
                    address = $9,
                    is_staff = $10,
                    is_active = $11,
                    is_superuser = $12,
                    user_password = $13
                  WHERE id_usuario = $14
                  RETURNING id_usuario AS id;
                `
                : `
                  UPDATE usuarios SET
                    id_rol = $1,
                    user_name = $2,
                    user_lastname = $3,
                    user_email = $4,
                    business_email = $5,
                    user_phone = $6,
                    user_document_types = $7,
                    user_document_number = $8,
                    address = $9,
                    is_staff = $10,
                    is_active = $11,
                    is_superuser = $12
                  WHERE id_usuario = $13
                  RETURNING id_usuario AS id;
                `;

            const fullValues = hasPassword
                ? [
                    idRol,
                    userName,
                    userLastName || "",
                    userEmail,
                    businessEmail || null,
                    userPhone,
                    userDocumentTypes,
                    userDocumentNumber,
                    address || null,
                    staffFlag,
                    activeBool,
                    isAdmin,
                    userPassword,
                    id,
                ]
                : [
                    idRol,
                    userName,
                    userLastName || "",
                    userEmail,
                    businessEmail || null,
                    userPhone,
                    userDocumentTypes,
                    userDocumentNumber,
                    address || null,
                    staffFlag,
                    activeBool,
                    isAdmin,
                    id,
                ];

            const result = await pool.query(fullQuery, fullValues);

            if (startDate) {
                try {
                    const existingContract = await pool.query(
                        `SELECT id_contrato FROM contratos_laborales WHERE id_usuario = $1 LIMIT 1`,
                        [id]
                    );
                    if (existingContract.rows.length > 0) {
                        await pool.query(
                            `UPDATE contratos_laborales SET start_date = $1, end_date = $2 WHERE id_usuario = $3`,
                            [startDate, endDate || null, id]
                        );
                    } else {
                        await pool.query(
                            `INSERT INTO contratos_laborales (id_usuario, start_date, end_date, estado_vinculo)
                             VALUES ($1, $2, $3, 'Activo')`,
                            [id, startDate, endDate || null]
                        );
                    }
                } catch {
                    // Ignorar si contratos_laborales no existe
                }
            }

            return result.rows[0];
        } catch (err) {
            if (err.code === "42703" || err.code === "42P01") {
                const hasPassword = userPassword && String(userPassword).trim().length > 0;
                const simpleQuery = hasPassword
                    ? `
                      UPDATE usuarios SET
                        user_name = $1,
                        user_email = $2,
                        user_phone = $3,
                        user_document_types = $4,
                        user_document_number = $5,
                        is_staff = $6,
                        is_active = $7,
                        is_superuser = $8,
                        user_password = $9
                      WHERE id_usuario = $10
                      RETURNING id_usuario AS id;
                    `
                    : `
                      UPDATE usuarios SET
                        user_name = $1,
                        user_email = $2,
                        user_phone = $3,
                        user_document_types = $4,
                        user_document_number = $5,
                        is_staff = $6,
                        is_active = $7,
                        is_superuser = $8
                      WHERE id_usuario = $9
                      RETURNING id_usuario AS id;
                    `;
                const simpleValues = hasPassword
                    ? [userName, userEmail, userPhone, userDocumentTypes, userDocumentNumber, staffFlag, activeBool, isAdmin, userPassword, id]
                    : [userName, userEmail, userPhone, userDocumentTypes, userDocumentNumber, staffFlag, activeBool, isAdmin, id];

                const result = await pool.query(simpleQuery, simpleValues);
                return result.rows[0];
            }
            throw err;
        }
    },

    async updateStatus(id, isActive) {
        const query =
            typeof isActive === "boolean"
                ? `UPDATE usuarios SET is_active = $1 WHERE id_usuario = $2 RETURNING id_usuario AS id, is_active, is_active AS "isActive";`
                : `UPDATE usuarios SET is_active = NOT is_active WHERE id_usuario = $1 RETURNING id_usuario AS id, is_active, is_active AS "isActive";`;
        const values = typeof isActive === "boolean" ? [isActive, id] : [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async disable(id) {
        const result = await pool.query(
            `UPDATE usuarios SET is_active = FALSE WHERE id_usuario = $1 RETURNING id_usuario AS id, is_active, is_active AS "isActive";`,
            [id]
        );
        return result.rows[0];
    }
};
