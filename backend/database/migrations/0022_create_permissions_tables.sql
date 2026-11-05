-- Aseguramos que existan los roles del sistema
INSERT INTO roles (nombre_rol) VALUES
    ('administrador'),
    ('mesero'),
    ('empleado'),
    ('cajero'),
    ('usuario')
ON CONFLICT (nombre_rol) DO NOTHING;

-- Tabla de permisos por rol
CREATE TABLE IF NOT EXISTS role_permissions (
    id_role_permission SERIAL PRIMARY KEY,
    id_rol INT NOT NULL REFERENCES roles(id_rol) ON DELETE CASCADE,
    module_id VARCHAR(50) NOT NULL,
    actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_rol, module_id)
);

-- Tabla de permisos especificos por usuario
CREATE TABLE IF NOT EXISTS user_permissions (
    id_user_permission SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    module_id VARCHAR(50) NOT NULL,
    actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_usuario, module_id)
);

