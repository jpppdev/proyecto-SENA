-- 1. Proveedores iniciales
INSERT INTO suppliers (supplier_name, contact_name, supplier_email, supplier_phone, supplier_address, is_active)
VALUES
    ('Café Quindío S.A.S', 'NIT 800123456', 'ventas@cafequindio.com', '3001112233', 'Av. Centenario # 15-20, Armenia', TRUE),
    ('Alquería', 'NIT 860001234', 'distribucion@alqueria.com.co', '3102223344', 'Km 5 Vía Cajicá', TRUE),
    ('Panadería El Molino', 'NIT 900555666', 'pedidos@elmolino.com', '3114445566', 'Cra 7 # 22-10, Dosquebradas', TRUE);

-- 2. Categorías del menú
INSERT INTO menu_categories (category_name, category_description, is_active)
VALUES
    ('Bebidas Calientes', 'Cafés, infusiones y chocolate caliente', TRUE),
    ('Bebidas Frías', 'Frappés, jugos y bebidas refrescantes', TRUE),
    ('Panadería y Repostería', 'Croissants, pasteles y acompañamientos', TRUE)
ON CONFLICT (category_name) DO NOTHING;

-- 3. Inventario inicial
INSERT INTO inventory (id_supplier, item_name, item_description, unit_of_measure, current_stock, minimum_stock, cost_per_unit, is_active)
VALUES
    ((SELECT id_supplier FROM suppliers ORDER BY id_supplier ASC LIMIT 1), 'Café en grano tostado', 'Café Quindío', 'kg', 50, 10, 25000, TRUE),
    ((SELECT id_supplier FROM suppliers ORDER BY id_supplier ASC LIMIT 1), 'Leche Entera Larga Vida', 'Alquería', 'l', 25, 15, 4500, TRUE),
    ((SELECT id_supplier FROM suppliers ORDER BY id_supplier ASC LIMIT 1), 'Panela Redonda', 'El Trapiche', 'ud', 80, 30, 2500, TRUE);

-- 4. Platos del menú / Productos iniciales
INSERT INTO menu_items (id_category, item_name, item_description, price, preparation_time, image_url, is_active, is_available)
VALUES
    ((SELECT id_category FROM menu_categories ORDER BY id_category ASC LIMIT 1), 'Capuchino Vainilla', 'Café espresso con leche vaporizada y toque de vainilla.', 7500, 5, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300', TRUE, TRUE),
    ((SELECT id_category FROM menu_categories ORDER BY id_category ASC LIMIT 1), 'Café Americano', 'Café negro recién preparado con granos seleccionados.', 5000, 3, 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=300', TRUE, TRUE),
    ((SELECT id_category FROM menu_categories ORDER BY id_category ASC LIMIT 1), 'Croissant de Mantequilla', 'Croissant artesanal horneado diariamente.', 4500, 4, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300', TRUE, TRUE);

-- 5. Mesas iniciales
INSERT INTO dining_tables (table_number, capacity, status, is_active)
VALUES
    (1, 4, 'available', TRUE),
    (2, 4, 'available', TRUE),
    (3, 6, 'available', TRUE)
ON CONFLICT (table_number) DO NOTHING;

-- 6. Órdenes iniciales
INSERT INTO orders (id_table, id_usuario, customer_name, order_status, total_amount)
SELECT
    (SELECT id_table FROM dining_tables ORDER BY id_table ASC LIMIT 1),
    id_usuario,
    'Juan Pérez',
    'En preparación',
    45000
FROM usuarios
ORDER BY id_usuario ASC
LIMIT 1;

