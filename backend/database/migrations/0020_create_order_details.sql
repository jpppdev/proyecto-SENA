CREATE TABLE IF NOT EXISTS order_details (
    id_order_detail SERIAL PRIMARY KEY,
    id_order INT NOT NULL,
    id_menu_item INT NOT NULL, 
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL, 
    subtotal DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,
    
    
    CONSTRAINT fk_detail_order FOREIGN KEY (id_order) REFERENCES orders(id_order) ON DELETE CASCADE,
    
    
    CONSTRAINT fk_detail_menu_item FOREIGN KEY (id_menu_item) REFERENCES menu_items(id_menu_item) ON DELETE RESTRICT
);