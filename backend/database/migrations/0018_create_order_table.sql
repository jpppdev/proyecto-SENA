CREATE TABLE IF NOT EXISTS orders (
    id_order SERIAL PRIMARY KEY,
    id_table INT, 
    id_usuario INT NOT NULL, 
    customer_name VARCHAR(150), 
    order_status VARCHAR(50) DEFAULT 'pending', 
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    
    CONSTRAINT fk_order_table FOREIGN KEY (id_table) REFERENCES dining_tables(id_table) ON DELETE SET NULL,
    
    
    CONSTRAINT fk_order_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);