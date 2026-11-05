CREATE TABLE IF NOT EXISTS menu_recipes (
    id_recipe SERIAL PRIMARY KEY,
    id_menu_item INT NOT NULL,
    id_inventory_item INT NOT NULL, 
    quantity_required DECIMAL(10, 2) NOT NULL, 
    
    CONSTRAINT fk_recipe_menu FOREIGN KEY (id_menu_item) REFERENCES menu_items(id_menu_item) ON DELETE CASCADE,
    
    CONSTRAINT fk_recipe_inventory FOREIGN KEY (id_inventory_item) REFERENCES inventory(id_item) ON DELETE RESTRICT
);