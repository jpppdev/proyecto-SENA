INSERT INTO roles (nombre_rol) VALUES
    ('administrador'),
    ('empleado')
ON CONFLICT (nombre_rol) DO NOTHING;