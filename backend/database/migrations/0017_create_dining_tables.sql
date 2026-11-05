CREATE TABLE IF NOT EXISTS dining_tables (
    id_table SERIAL PRIMARY KEY,
    table_number INT NOT NULL UNIQUE,
    capacity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'available', 
    is_active BOOLEAN DEFAULT TRUE
);