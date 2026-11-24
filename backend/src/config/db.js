// Importamos el paquete "pg" usando el sistema de modulos ES. // importamos el paquete SQL para node.js

import pkg from "pg";

// Extraemos la clase Pool desde el paquete.
// Pool gestiona un conjunto de conexiones reutilizables a la BD.

const { Pool } = pkg;

// Importamos detonv para poder leer variables de entorno desde un archivo.env
import dotenv from "dotenv";
<<<<<<< Updated upstream
import { fileURLToPath } from "node:url";
=======
import { fileURLToPath } from "url";
import path from "path";
>>>>>>> Stashed changes

//Cargamos las variables de entorno desde el archivo .env

// Esto debe ejecutarse antes de acceder a process.env
<<<<<<< Updated upstream
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)), quiet: true });
=======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
>>>>>>> Stashed changes

// Creamos y exportamos una instancia unica del Pool de PostgreSQL
// Esta instancia se reutiliza en toda la aplicacion
export const pool = new Pool({
    // Host donde se encuentra PostgreSQL (ej: locarlhost o IP del servidor)
    host: process.env.DB_HOST || "localhost",


    // PUerta de PostgreSQL (por defecto 5432)
    port: Number(process.env.DB_PORT) || 5432,

    // Usuario con permisos sobre la base de datos
    user: process.env.DB_USER || "postgres",

    // Contraseña del usuario
    password: process.env.DB_PASSWORD || "123456",

    // Nombre de la base de datos a la que nos conectaremos
    database: process.env.DB_NAME || "aurum",

    // numero máximo de conexiones activas en el pool
    max: 20,
    connectionTimeoutMillis: 5000,

    //Tiempo maximo (en ms) que una conexion puede estar inactiva
    // antes de ser cerrada automaticamente

    idleTimeoutMillis: 30000,

});

// Evento que se dispara cada vez que el pool establece unna conexion
// Util para logs y verificacion en desarrollo
pool.on('connect', () => {
    console.log('Conectado a PostgreSQL');
});

// Evento que se dispara cuando ocurre un error en el pool
// Importante para monitoreo y diagnostico de fallos
pool.on('error', (err) => {
    console.error('Error en la conexion con PostgreSQL:', err);
});

<<<<<<< Updated upstream
=======
// Inicializacion automatica de tablas y datos semilla si estan vacias
async function initDatabaseTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id_rol SERIAL PRIMARY KEY,
                nombre_rol VARCHAR(50) NOT NULL UNIQUE
            );

            INSERT INTO roles (nombre_rol) VALUES
                ('administrador'),
                ('mesero'),
                ('empleado'),
                ('cajero'),
                ('usuario')
            ON CONFLICT (nombre_rol) DO NOTHING;

            CREATE TABLE IF NOT EXISTS usuarios (
                id_usuario SERIAL PRIMARY KEY,
                id_rol INT DEFAULT 1 REFERENCES roles(id_rol) ON DELETE RESTRICT,
                user_name VARCHAR(100) NOT NULL,
                user_lastname VARCHAR(100) DEFAULT '',
                user_email VARCHAR(150) UNIQUE NOT NULL,
                business_email VARCHAR(150) UNIQUE,
                user_phone VARCHAR(20),
                user_document_types VARCHAR(20) DEFAULT 'CC',
                user_document_number VARCHAR(50) UNIQUE,
                address VARCHAR(255),
                user_password TEXT NOT NULL,
                user_avatar_url TEXT,
                is_staff BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                is_superuser BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id_token SERIAL PRIMARY KEY,
                user_email VARCHAR(150) NOT NULL,
                token VARCHAR(10) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Si no existe ningún usuario en la tabla usuarios, creamos un administrador por defecto
        const { rows: userCount } = await pool.query(`SELECT COUNT(*)::INT AS count FROM usuarios`);
        if (userCount[0].count === 0) {
            await pool.query(`
                INSERT INTO usuarios (
                    id_rol, user_name, user_lastname, user_email, user_phone,
                    user_document_types, user_document_number, user_password,
                    is_staff, is_active, is_superuser
                ) VALUES (
                    (SELECT id_rol FROM roles WHERE nombre_rol = 'administrador' LIMIT 1),
                    'Administrador', 'Aurum', 'admin@aurum.com', '3001234567',
                    'CC', '1000000001', 'Admin123*',
                    TRUE, TRUE, TRUE
                ) ON CONFLICT (user_email) DO NOTHING;
            `);
        }

        await pool.query(`
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

            CREATE TABLE IF NOT EXISTS menu_categories (
                id_category SERIAL PRIMARY KEY,
                category_name VARCHAR(100) NOT NULL UNIQUE,
                category_description TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS inventory (
                id_item SERIAL PRIMARY KEY,
                id_supplier INT REFERENCES suppliers(id_supplier) ON DELETE SET NULL,
                item_name VARCHAR(150) NOT NULL,
                item_description TEXT,
                unit_of_measure VARCHAR(50) NOT NULL,
                current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
                minimum_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
                cost_per_unit DECIMAL(10, 2) NOT NULL DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS menu_items (
                id_menu_item SERIAL PRIMARY KEY,
                id_category INT NOT NULL REFERENCES menu_categories(id_category) ON DELETE RESTRICT,
                item_name VARCHAR(150) NOT NULL,
                item_description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                preparation_time INT,
                image_url VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                is_available BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS dining_tables (
                id_table SERIAL PRIMARY KEY,
                table_number INT NOT NULL UNIQUE,
                capacity INT NOT NULL,
                status VARCHAR(50) DEFAULT 'available',
                is_active BOOLEAN DEFAULT TRUE
            );

            CREATE TABLE IF NOT EXISTS orders (
                id_order SERIAL PRIMARY KEY,
                id_table INT REFERENCES dining_tables(id_table) ON DELETE SET NULL,
                id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
                customer_name VARCHAR(150),
                order_status VARCHAR(50) DEFAULT 'pending',
                total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS order_details (
                id_order_detail SERIAL PRIMARY KEY,
                id_order INT NOT NULL REFERENCES orders(id_order) ON DELETE CASCADE,
                id_menu_item INT NOT NULL REFERENCES menu_items(id_menu_item) ON DELETE RESTRICT,
                quantity INT NOT NULL CHECK (quantity > 0),
                unit_price DECIMAL(10, 2) NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL,
                notes TEXT
            );
        `);

        // Si las tablas estan vacias, insertamos datos iniciales para los listados
        const { rows: supCount } = await pool.query(`SELECT COUNT(*)::INT AS count FROM suppliers`);
        if (supCount[0].count === 0) {
            await pool.query(`
                INSERT INTO suppliers (supplier_name, contact_name, supplier_email, supplier_phone, supplier_address, is_active)
                VALUES
                    ('Café Quindío S.A.S', 'NIT 800123456', 'ventas@cafequindio.com', '3001112233', 'Av. Centenario # 15-20, Armenia', TRUE),
                    ('Alquería', 'NIT 860001234', 'distribucion@alqueria.com.co', '3102223344', 'Km 5 Vía Cajicá', TRUE),
                    ('Panadería El Molino', 'NIT 900555666', 'pedidos@elmolino.com', '3114445566', 'Cra 7 # 22-10, Dosquebradas', TRUE);
            `);
        }

        const { rows: catCount } = await pool.query(`SELECT COUNT(*)::INT AS count FROM menu_categories`);
        if (catCount[0].count === 0) {
            await pool.query(`
                INSERT INTO menu_categories (category_name, category_description, is_active)
                VALUES
                    ('Bebidas Calientes', 'Cafés, infusiones y chocolate caliente', TRUE),
                    ('Bebidas Frías', 'Frappés, jugos y bebidas refrescantes', TRUE),
                    ('Panadería y Repostería', 'Croissants, pasteles y acompañamientos', TRUE)
                ON CONFLICT (category_name) DO NOTHING;
            `);
        }

        const { rows: invCount } = await pool.query(`SELECT COUNT(*)::INT AS count FROM inventory`);
        if (invCount[0].count === 0) {
            await pool.query(`
                INSERT INTO inventory (id_supplier, item_name, item_description, unit_of_measure, current_stock, minimum_stock, cost_per_unit, is_active)
                VALUES
                    ((SELECT id_supplier FROM suppliers ORDER BY id_supplier ASC LIMIT 1), 'Café en grano tostado', 'Café Quindío', 'kg', 50, 10, 25000, TRUE),
                    ((SELECT id_supplier FROM suppliers ORDER BY id_supplier ASC LIMIT 1), 'Leche Entera Larga Vida', 'Alquería', 'l', 25, 15, 4500, TRUE),
                    ((SELECT id_supplier FROM suppliers ORDER BY id_supplier ASC LIMIT 1), 'Panela Redonda', 'El Trapiche', 'ud', 80, 30, 2500, TRUE);
            `);
        }

        const { rows: menuCount } = await pool.query(`SELECT COUNT(*)::INT AS count FROM menu_items`);
        if (menuCount[0].count === 0) {
            await pool.query(`
                INSERT INTO menu_items (id_category, item_name, item_description, price, preparation_time, image_url, is_active, is_available)
                VALUES
                    ((SELECT id_category FROM menu_categories ORDER BY id_category ASC LIMIT 1), 'Capuchino Vainilla', 'Café espresso con leche vaporizada y toque de vainilla.', 7500, 5, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300', TRUE, TRUE),
                    ((SELECT id_category FROM menu_categories ORDER BY id_category ASC LIMIT 1), 'Café Americano', 'Café negro recién preparado con granos seleccionados.', 5000, 3, 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=300', TRUE, TRUE),
                    ((SELECT id_category FROM menu_categories ORDER BY id_category ASC LIMIT 1), 'Croissant de Mantequilla', 'Croissant artesanal horneado diariamente.', 4500, 4, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300', TRUE, TRUE);
            `);
        }

        const { rows: tableCount } = await pool.query(`SELECT COUNT(*)::INT AS count FROM dining_tables`);
        if (tableCount[0].count === 0) {
            await pool.query(`
                INSERT INTO dining_tables (table_number, capacity, status, is_active)
                VALUES (1, 4, 'available', TRUE), (2, 4, 'available', TRUE), (3, 6, 'available', TRUE)
                ON CONFLICT (table_number) DO NOTHING;
            `);
        }

        const { rows: ordCount } = await pool.query(`SELECT COUNT(*)::INT AS count FROM orders`);
        if (ordCount[0].count === 0) {
            await pool.query(`
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
            `);
        }

        // Inicializar tablas de roles y permisos (por rol y por usuario)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id_rol SERIAL PRIMARY KEY,
                nombre_rol VARCHAR(50) NOT NULL UNIQUE
            );

            INSERT INTO roles (nombre_rol) VALUES
                ('administrador'),
                ('mesero'),
                ('empleado'),
                ('cajero'),
                ('usuario')
            ON CONFLICT (nombre_rol) DO NOTHING;

            CREATE TABLE IF NOT EXISTS role_permissions (
                id_role_permission SERIAL PRIMARY KEY,
                id_rol INT NOT NULL REFERENCES roles(id_rol) ON DELETE CASCADE,
                module_id VARCHAR(50) NOT NULL,
                actions JSONB NOT NULL DEFAULT '[]'::jsonb,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (id_rol, module_id)
            );

            CREATE TABLE IF NOT EXISTS user_permissions (
                id_user_permission SERIAL PRIMARY KEY,
                id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                module_id VARCHAR(50) NOT NULL,
                actions JSONB NOT NULL DEFAULT '[]'::jsonb,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (id_usuario, module_id)
            );
        `);

        const { rows: permCount } = await pool.query(`SELECT COUNT(*)::INT AS count FROM role_permissions`);
        if (permCount[0].count === 0) {
            const initialRolePerms = {
                administrador: {
                    users: ["view", "create", "edit", "delete"],
                    inventory: ["view", "create", "edit", "delete"],
                    orders: ["view", "create", "edit", "delete"],
                    menu: ["view", "create", "edit", "delete"],
                    providers: ["view", "create", "edit", "delete"]
                },
                mesero: {
                    users: [],
                    inventory: ["view"],
                    orders: ["view", "create", "edit"],
                    menu: ["view"],
                    providers: []
                },
                empleado: {
                    users: [],
                    inventory: ["view"],
                    orders: ["view", "create", "edit"],
                    menu: ["view"],
                    providers: ["view"]
                },
                cajero: {
                    users: [],
                    inventory: ["view"],
                    orders: ["view", "create", "edit"],
                    menu: ["view"],
                    providers: []
                },
                usuario: {
                    users: [],
                    inventory: [],
                    orders: ["view", "create"],
                    menu: ["view"],
                    providers: []
                }
            };

            for (const [roleName, modules] of Object.entries(initialRolePerms)) {
                for (const [moduleId, actions] of Object.entries(modules)) {
                    await pool.query(
                        `INSERT INTO role_permissions (id_rol, module_id, actions)
                         SELECT id_rol, $2, $3::jsonb FROM roles WHERE nombre_rol = $1
                         ON CONFLICT (id_rol, module_id) DO NOTHING`,
                        [roleName, moduleId, JSON.stringify(actions)]
                    );
                }
            }
        }
    } catch (err) {
        console.error('Aviso al verificar tablas iniciales:', err.message);
    }
}

initDatabaseTables();
>>>>>>> Stashed changes
