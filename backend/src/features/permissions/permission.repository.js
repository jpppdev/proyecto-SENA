// Importamos el pool de conexion a PostgreSQL
// Este pool es una instancia compartida configurada en la capa infraestructura.

import { pool } from "../../config/db.js";

const DEFAULT_MODULES = ["users", "inventory", "orders", "menu", "providers"];

const ROLE_LABELS = {
    administrador: "Administrador (Acceso Total)",
    mesero: "Mesero",
    empleado: "Empleado",
    cajero: "Cajero",
    usuario: "Usuario Normal"
};

// Exportamos el repositorio de permisos
// El repository encapsula todas las consultas SQL relacionadas con roles y permisos.
export const permissionRepository = {

    async ensureTables() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id_rol SERIAL PRIMARY KEY,
                nombre_rol VARCHAR(50) NOT NULL UNIQUE
            );

            INSERT INTO roles (nombre_rol) VALUES
                ('administrador'),
                ('mesero'),
                ('empleado'),
                ('cajero'),
                ('usuario')
            ON CONFLICT (nombre_rol) DO NOTHING;

            CREATE TABLE IF NOT EXISTS role_permissions (
                id_role_permission SERIAL PRIMARY KEY,
                id_rol INT NOT NULL REFERENCES roles(id_rol) ON DELETE CASCADE,
                module_id VARCHAR(50) NOT NULL,
                actions JSONB NOT NULL DEFAULT '[]'::jsonb,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (id_rol, module_id)
            );

            CREATE TABLE IF NOT EXISTS user_permissions (
                id_user_permission SERIAL PRIMARY KEY,
                id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                module_id VARCHAR(50) NOT NULL,
                actions JSONB NOT NULL DEFAULT '[]'::jsonb,
                role_name VARCHAR(50),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (id_usuario, module_id)
            );
        `);
    },

    // Obtiene todos los roles, sus permisos por modulo, la lista de usuarios en BD y sus permisos especificos
    async getAllData() {
        await this.ensureTables();

        // 1. Obtener roles
        const rolesRes = await pool.query(`
            SELECT id_rol AS id, nombre_rol AS value
            FROM roles
            ORDER BY id_rol ASC;
        `);

        const roles = rolesRes.rows.map((r) => ({
            id: r.id,
            value: r.value,
            label: ROLE_LABELS[r.value] || r.value.charAt(0).toUpperCase() + r.value.slice(1)
        }));

        // 2. Obtener permisos de todos los roles
        const rolePermsRes = await pool.query(`
            SELECT r.nombre_rol AS "roleName", rp.module_id AS "moduleId", rp.actions
            FROM role_permissions rp
            INNER JOIN roles r ON rp.id_rol = r.id_rol;
        `);

        const rolePermissions = {};
        for (const role of roles) {
            rolePermissions[role.value] = {
                users: [],
                inventory: [],
                orders: [],
                menu: [],
                providers: []
            };
        }

        for (const row of rolePermsRes.rows) {
            if (!rolePermissions[row.roleName]) {
                rolePermissions[row.roleName] = {};
            }
            rolePermissions[row.roleName][row.moduleId] = Array.isArray(row.actions) ? row.actions : [];
        }

        // 3. Obtener todos los usuarios registrados en la tabla usuarios
        const usersRes = await pool.query(`
            SELECT 
                id_usuario AS id,
                user_name AS "userName",
                user_email AS "userEmail",
                user_phone AS "userPhone",
                is_staff AS "isStaff",
                is_superuser AS "isSuperUser",
                CASE 
                    WHEN is_superuser = TRUE THEN 'administrador'
                    WHEN is_staff = TRUE THEN 'empleado'
                    ELSE 'usuario'
                END AS "roleName"
            FROM usuarios
            ORDER BY id_usuario DESC;
        `);

        // 4. Obtener permisos especificos asignados directamente a usuarios individuales
        const userPermsRes = await pool.query(`
            SELECT id_usuario AS "userId", module_id AS "moduleId", actions
            FROM user_permissions;
        `);

        const userPermissions = {};
        for (const row of userPermsRes.rows) {
            const uid = String(row.userId);
            if (!userPermissions[uid]) {
                userPermissions[uid] = {};
            }
            userPermissions[uid][row.moduleId] = Array.isArray(row.actions) ? row.actions : [];
        }

        return {
            roles,
            rolePermissions,
            users: usersRes.rows,
            userPermissions
        };
    },

    // Guarda o actualiza los permisos de un rol en la base de datos
    async saveRolePermissions(roleName, permissionsByModule) {
        await this.ensureTables();
        const roleRes = await pool.query(
            `SELECT id_rol FROM roles WHERE nombre_rol = $1`,
            [roleName]
        );

        let roleId;
        if (roleRes.rows.length === 0) {
            const inserted = await pool.query(
                `INSERT INTO roles (nombre_rol) VALUES ($1) RETURNING id_rol`,
                [roleName]
            );
            roleId = inserted.rows[0].id_rol;
        } else {
            roleId = roleRes.rows[0].id_rol;
        }

        for (const moduleId of DEFAULT_MODULES) {
            const actions = Array.isArray(permissionsByModule?.[moduleId])
                ? permissionsByModule[moduleId]
                : [];

            await pool.query(
                `INSERT INTO role_permissions (id_rol, module_id, actions, updated_at)
                 VALUES ($1, $2, $3::jsonb, CURRENT_TIMESTAMP)
                 ON CONFLICT (id_rol, module_id)
                 DO UPDATE SET actions = EXCLUDED.actions, updated_at = CURRENT_TIMESTAMP`,
                [roleId, moduleId, JSON.stringify(actions)]
            );
        }

        return { roleName, permissions: permissionsByModule };
    },

    // Guarda o actualiza los permisos especificos de un usuario de la base de datos
    async saveUserPermissions(userId, permissionsByModule, roleName) {
        await this.ensureTables();
        if (roleName) {
            const isAdmin = roleName === "administrador";
            const isStaff = roleName !== "usuario";
            await pool.query(
                `UPDATE usuarios SET is_superuser = $1, is_staff = $2 WHERE id_usuario = $3`,
                [isAdmin, isStaff, Number(userId)]
            );
        }

        for (const moduleId of DEFAULT_MODULES) {
            const actions = Array.isArray(permissionsByModule?.[moduleId])
                ? permissionsByModule[moduleId]
                : [];

            await pool.query(
                `INSERT INTO user_permissions (id_usuario, module_id, actions, updated_at)
                 VALUES ($1, $2, $3::jsonb, CURRENT_TIMESTAMP)
                 ON CONFLICT (id_usuario, module_id)
                 DO UPDATE SET actions = EXCLUDED.actions, updated_at = CURRENT_TIMESTAMP`,
                [Number(userId), moduleId, JSON.stringify(actions)]
            );
        }

        return { userId: Number(userId), roleName, permissions: permissionsByModule };
    }
};
