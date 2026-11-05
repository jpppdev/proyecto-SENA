CREATE TABLE IF NOT EXISTS menu_items (
    id_menu_item SERIAL PRIMARY KEY,
    id_category INT NOT NULL, 
    item_name VARCHAR(150) NOT NULL,
    item_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    preparation_time INT, 
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    
    CONSTRAINT fk_menu_item_category FOREIGN KEY (id_category) REFERENCES menu_categories(id_category) ON DELETE RESTRICT
);