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
        const query = `
          SELECT 
            id_usuario AS id, 
            user_name AS "userName", 
            user_email AS "userEmail", 
            user_phone AS "userPhone", 
            is_active,
            is_active AS "isActive"
          FROM usuarios 
          ORDER BY id_usuario DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    async getById(id) {
        const query = `
          SELECT 
            id_usuario AS id, 
            user_name AS "userName", 
            user_email AS "userEmail", 
            user_phone AS "userPhone",
            user_document_types AS "userDocumentTypes",
            user_document_number AS "userDocumentNumber",
            is_staff AS "isStaff",
            is_active,
            is_active AS "isActive",
            is_superuser AS "isSuperUser"
          FROM usuarios 
          WHERE id_usuario = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};
