CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_lastname VARCHAR(100) NOT NULL,
    user_email VARCHAR(150) UNIQUE NOT NULL,
    business_email VARCHAR(150) UNIQUE,
    user_phone VARCHAR(20),
    user_document_types VARCHAR(20) NOT NULL,
    user_document_number VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(255),
    user_password TEXT NOT NULL,
    user_avatar_url TEXT,
    is_staff BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT
);