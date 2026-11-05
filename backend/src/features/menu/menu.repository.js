// Importamos el pool de conexion a PostgreSQL
// Este pool es una instancia compartida configurada en la capa infraestructura.

import { pool } from "../../config/db.js";

// Exportamos el repositorio de menu
// El repository encapsula todas las consultas SQL relacionadas con menu_items.
export const menuRepository = {

    // Metodo encargado de crear un plato del menu en la base de datos.
    // Recibe un objeto con los datos ya validados y procesados por el service.
    async create(menuData) {

        // Desestructuramos explicitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
            category = "General",
            menuName,
            description,
            price,
            prepTime,
            imageUrl = null,
            isActive = true,
            isAvailable = true,
        } = menuData;

        // Aseguramos que la categoria exista en menu_categories para cumplir la llave foranea
        const categoryRes = await pool.query(
            `INSERT INTO menu_categories (category_name)
             VALUES ($1)
             ON CONFLICT (category_name) DO UPDATE SET category_name = EXCLUDED.category_name
             RETURNING id_category;`,
            [String(category)]
        );
        const idCategory = categoryRes.rows[0].id_category;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (id_menu_item)
        const query = `
        INSERT INTO menu_items (
            id_category,
            item_name,
            item_description,
            price,
            preparation_time,
            image_url,
            is_active,
            is_available
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8
        ) RETURNING id_menu_item AS id;
        `;

        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            idCategory,
            menuName,
            description,
            Number(price) || 0,
            prepTime ? Number(prepTime) : null,
            imageUrl,
            isActive,
            isAvailable,
        ];

        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);

        // Devolvemos unicamente el primer registro retornado
        // En este caso contiene el id del plato del menu recien creado
        return result.rows[0];
    },

    async getAll() {
        const query = `
          SELECT 
            m.id_menu_item AS id,
            m.item_name AS "menuName",
            COALESCE(c.category_name, m.id_category::TEXT) AS category,
            COALESCE(CAST(m.price AS FLOAT), 0) AS price,
            m.preparation_time AS "prepTime",
            m.item_description AS description,
            COALESCE(m.image_url, 'https://via.placeholder.com/48?text=Sin+Foto') AS "menuImage",
            m.is_active AS "isActive"
          FROM menu_items m
          LEFT JOIN menu_categories c ON m.id_category = c.id_category
          ORDER BY m.id_menu_item DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    async getById(id) {
        const query = `
          SELECT 
            m.id_menu_item AS id,
            m.item_name AS "menuName",
            COALESCE(c.category_name, m.id_category::TEXT) AS category,
            COALESCE(CAST(m.price AS FLOAT), 0) AS price,
            m.preparation_time AS "prepTime",
            m.item_description AS description,
            COALESCE(m.image_url, 'https://via.placeholder.com/48?text=Sin+Foto') AS "menuImage",
            m.is_active AS "isActive"
          FROM menu_items m
          LEFT JOIN menu_categories c ON m.id_category = c.id_category
          WHERE m.id_menu_item = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};
