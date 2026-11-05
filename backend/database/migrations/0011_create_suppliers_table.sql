CREATE TABLE IF NOT EXISTS suppliers (
    id_supplier SERIAL PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100),
    supplier_email VARCHAR(150),
    supplier_phone VARCHAR(20),
    supplier_address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);