// Importamos el pool de conexion a PostgreSQL
// Este pool es una instancia compartida configurada en la capa infraestructura.

import { pool } from "../../config/db.js";

// Exportamos el repositorio de inventario
// El repository encapsula todas las consultas SQL relacionadas con inventory.
export const inventoryRepository = {

    // Metodo encargado de crear un producto de inventario en la base de datos.
    // Recibe un objeto con los datos ya validados y procesados por el service.
    async create(inventoryData) {

        // Desestructuramos explicitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
            provider,
            productName,
            description,
            unit,
            initialQuantity = 0,
            minStock = 0,
            costPerUnit = 0,
            status = true,
        } = inventoryData;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (id_item)
        const query = `
        INSERT INTO inventory (
            id_supplier,
            item_name,
            item_description,
            unit_of_measure,
            current_stock,
            minimum_stock,
            cost_per_unit,
            is_active
        ) VALUES (
            (SELECT id_supplier FROM suppliers WHERE id_supplier = $1),
            $2, $3, $4, $5, $6, $7, $8
        ) RETURNING id_item AS id;
        `;

        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            Number.isInteger(Number(provider)) && provider !== "" ? Number(provider) : null,
            productName,
            description,
            unit,
            Number(initialQuantity) || 0,
            Number(minStock) || 0,
            Number(costPerUnit) || 0,
            status,
        ];

        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);

        // Devolvemos unicamente el primer registro retornado
        // En este caso contiene el id del item de inventario recien creado
        return result.rows[0];
    },

    async getAll() {
        const query = `
          SELECT 
            id_item AS id,
            CONCAT('INV-', LPAD(id_item::TEXT, 3, '0')) AS barcode,
            item_name AS "productName",
            COALESCE(item_description, unit_of_measure) AS brand,
            COALESCE(item_description, '') AS description,
            unit_of_measure AS unit,
            COALESCE(id_supplier::TEXT, 'dist_nac') AS provider,
            COALESCE(CAST(current_stock AS FLOAT), 0) AS quantity,
            COALESCE(CAST(minimum_stock AS FLOAT), 0) AS "minQuantity",
            COALESCE(CAST(cost_per_unit AS FLOAT), 0) AS "unitValue",
            CASE 
              WHEN NOT is_active THEN 'inactivo'
              WHEN current_stock <= 0 THEN 'agotado'
              WHEN current_stock <= minimum_stock THEN 'bajo stock'
              ELSE 'disponible'
            END AS status,
            is_active AS "isActive"
          FROM inventory 
          ORDER BY id_item DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    async getById(id) {
        const query = `
          SELECT 
            i.id_item AS id,
            CONCAT('INV-', LPAD(i.id_item::TEXT, 3, '0')) AS barcode,
            CONCAT('INV-', LPAD(i.id_item::TEXT, 3, '0')) AS "barCode",
            i.item_name AS "productName",
            COALESCE(i.unit_of_measure, 'ud') AS unit,
            COALESCE(i.unit_of_measure, 'Unidad') AS brand,
            COALESCE(i.item_description, '') AS description,
            COALESCE(i.id_supplier::TEXT, 'dist_nac') AS provider,
            COALESCE(s.supplier_name, 'Sin proveedor asignado') AS supplier,
            COALESCE(CAST(i.current_stock AS FLOAT), 0) AS quantity,
            COALESCE(CAST(i.current_stock AS FLOAT), 0) AS "totalQuantity",
            COALESCE(CAST(i.minimum_stock AS FLOAT), 0) AS "minQuantity",
            COALESCE(CAST(i.minimum_stock AS FLOAT), 0) AS "minimumQuantity",
            COALESCE(CAST(i.cost_per_unit AS FLOAT), 0) AS "unitValue",
            COALESCE(CAST(i.current_stock * i.cost_per_unit AS FLOAT), 0) AS "totalValue",
            CASE 
              WHEN NOT i.is_active THEN 'inactivo'
              WHEN i.current_stock <= 0 THEN 'agotado'
              WHEN i.current_stock <= i.minimum_stock THEN 'bajo stock'
              ELSE 'disponible'
            END AS status,
            i.is_active AS "isActive"
          FROM inventory i
          LEFT JOIN suppliers s ON i.id_supplier = s.id_supplier
          WHERE i.id_item = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async update(id, inventoryData) {
        const {
            provider,
            productName,
            description,
            unit,
            initialQuantity = 0,
            minStock = 0,
            costPerUnit,
            status = true,
        } = inventoryData;

        const supplierId = Number.isInteger(Number(provider)) && provider !== "" ? Number(provider) : null;

        const query = `
          UPDATE inventory SET
            id_supplier = COALESCE((SELECT id_supplier FROM suppliers WHERE id_supplier = $1), id_supplier),
            item_name = $2,
            item_description = $3,
            unit_of_measure = $4,
            current_stock = $5,
            minimum_stock = $6,
            cost_per_unit = COALESCE($7, cost_per_unit),
            is_active = $8,
            last_updated = CURRENT_TIMESTAMP
          WHERE id_item = $9
          RETURNING id_item AS id;
        `;

        const values = [
            supplierId,
            productName,
            description || "",
            unit || "ud",
            Number(initialQuantity) || 0,
            Number(minStock) || 0,
            costPerUnit !== undefined ? Number(costPerUnit) : null,
            Boolean(status),
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async updateStatus(id, isActive) {
        const query =
            typeof isActive === "boolean"
                ? `UPDATE inventory SET is_active = $1, last_updated = CURRENT_TIMESTAMP WHERE id_item = $2 RETURNING id_item AS id, is_active AS "isActive";`
                : `UPDATE inventory SET is_active = NOT is_active, last_updated = CURRENT_TIMESTAMP WHERE id_item = $1 RETURNING id_item AS id, is_active AS "isActive";`;
        const values = typeof isActive === "boolean" ? [isActive, id] : [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async disable(id) {
        const result = await pool.query(
            `UPDATE inventory SET is_active = FALSE, last_updated = CURRENT_TIMESTAMP WHERE id_item = $1 RETURNING id_item AS id, is_active AS "isActive";`,
            [id]
        );
        return result.rows[0];
    }
};
