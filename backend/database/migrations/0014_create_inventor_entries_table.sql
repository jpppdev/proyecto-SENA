CREATE TABLE IF NOT EXISTS inventory_entries (
    id_entry SERIAL PRIMARY KEY,
    id_item INT NOT NULL,    
    id_usuario INT NOT NULL, 
    quantity_added DECIMAL(10, 2) NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    
    CONSTRAINT fk_entry_item FOREIGN KEY (id_item) REFERENCES inventory(id_item) ON DELETE RESTRICT,
    
    
    CONSTRAINT fk_entry_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);