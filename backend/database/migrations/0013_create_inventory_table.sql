CREATE TABLE IF NOT EXISTS inventory (
    id_item SERIAL PRIMARY KEY,
    id_supplier INT, 
    item_name VARCHAR(150) NOT NULL,
    item_description TEXT,
    unit_of_measure VARCHAR(50) NOT NULL,
    current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    minimum_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    cost_per_unit DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    
    CONSTRAINT fk_inventory_supplier FOREIGN KEY (id_supplier) REFERENCES suppliers(id_supplier) ON DELETE SET NULL
);