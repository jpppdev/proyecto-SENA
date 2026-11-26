// Importamos el pool de conexion a PostgreSQL
// Este pool es una instancia compartida configurada en la capa infraestructura.

import { pool } from "../../config/db.js";

const hasActiveOrder = `
    EXISTS (
        SELECT 1 FROM orders o
        WHERE o.id_table = t.id_table
          AND LOWER(TRIM(o.order_status)) IN ('pending', 'pendiente', 'en preparación')
    )
`;

const tableIsFree = `t.is_active IS TRUE AND t.status = 'available' AND NOT ${hasActiveOrder}`;

async function lockAvailableTable(client, tableNumber) {
    const number = Number(tableNumber);
    if (!Number.isSafeInteger(number) || number <= 0 || number > 2147483647) {
        throw Object.assign(new Error("Selecciona un número de mesa válido."), { status: 400 });
    }

    const locked = await client.query(
        "SELECT id_table FROM dining_tables WHERE table_number = $1 FOR UPDATE",
        [number]
    );
    const tableId = locked.rows[0]?.id_table;
    if (tableId) {
        const available = await client.query(
            `SELECT 1 FROM dining_tables t WHERE t.id_table = $1 AND ${tableIsFree}`,
            [tableId]
        );
        if (available.rows.length) return tableId;
    }

    throw Object.assign(new Error("La mesa ya no está disponible. Selecciona otra mesa."), { status: 409 });
}

async function insertOrder(client, orderData) {
    // Desestructuramos explicitamente las propiedades esperadas
    // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
    const {
        tableNumber,
        idUsuario,
        customerName,
        orderStatus = "pending",
        total = 0,
    } = orderData;

    const needsTable = orderData.orderType === "mesa";
    const hasTable = tableNumber != null && tableNumber !== "";
    const resolvedTableId = needsTable || (!orderData.orderType && hasTable)
        ? await lockAvailableTable(client, tableNumber)
        : null;

    // Definimos la consulta SQL parametrizada
    // Usar placeholders ($1, $2, ...) previene inyecciones SQL
    // RETURNING permite obtener datos generados por la base de datos (id_order)
    const query = `
    INSERT INTO orders (
        id_table,
        id_usuario,
        customer_name,
        order_status,
        total_amount
    ) VALUES (
        $1,
        COALESCE($2, (SELECT id_usuario FROM usuarios ORDER BY id_usuario ASC LIMIT 1)),
        $3,
        $4,
        $5
    ) RETURNING id_order AS id;
    `;

    // Array de valores que se pasan al query
    // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
    const values = [
        resolvedTableId,
        idUsuario || null,
        customerName || "Cliente general",
        orderStatus,
        Number(total) || 0,
    ];

    // Ejecutamos la consulta usando el pool
    // client.query retorna un objeto con metadata y filas resultantes
    const result = await client.query(query, values);
    const createdOrder = result.rows[0];

    // Si vienen items en la orden, los guardamos en order_details
    if (createdOrder?.id && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
            const productId = Number(item.productId);
            const quantity = Number(item.quantity);
            const price = Number(item.price);
            if (!Number.isInteger(productId) || productId < 1 || productId > 2147483647
                || !Number.isInteger(quantity) || quantity < 1 || quantity > 2147483647
                || !Number.isFinite(price) || price < 0) {
                throw Object.assign(new Error("Selecciona productos del menú y cantidades válidas."), { status: 422 });
            }

            const detail = await client.query(
                `INSERT INTO order_details (id_order, id_menu_item, quantity, unit_price, subtotal, notes)
                 SELECT $1, id_menu_item, $3, $4, $5, $6
                 FROM menu_items WHERE id_menu_item = $2 AND is_active IS TRUE`,
                [createdOrder.id, productId, quantity, price, quantity * price, orderData.observations || null]
            );
            if (!detail.rowCount) {
                throw Object.assign(new Error("Un producto ya no está disponible. Retíralo de la orden y vuelve a intentarlo."), { status: 422 });
            }
        }
    }

    // Devolvemos unicamente el primer registro retornado
    // En este caso contiene el id de la orden recien creada
    return createdOrder;
}

// Exportamos el repositorio de ordenes
// El repository encapsula todas las consultas SQL relacionadas con orders.
export const orderRepository = {
    async getAvailableTables(includeUnavailable = false) {
        const result = await pool.query(`
            SELECT t.table_number AS "tableNumber", t.capacity
            ${includeUnavailable ? `, CASE
                WHEN t.is_active IS NOT TRUE THEN 'out_of_service'
                WHEN ${hasActiveOrder} OR t.status = 'occupied' THEN 'occupied'
                WHEN t.status IN ('available', 'reserved') THEN t.status
                ELSE 'out_of_service'
            END AS status` : ""}
            FROM dining_tables t
            ${includeUnavailable ? "" : `WHERE ${tableIsFree}`}
            ORDER BY t.table_number
        `);
        return result.rows;
    },

    // Metodo encargado de crear una orden en la base de datos.
    // Recibe un objeto con los datos ya validados y procesados por el service.
    async create(orderData) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const order = await insertOrder(client, orderData);
            await client.query("COMMIT");
            return order;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },

    async getAll() {
        const query = `
          SELECT 
            o.id_order AS id,
            COALESCE(o.customer_name, 'Cliente general') AS "customerName",
            TO_CHAR(o.created_at, 'DD/MM/YYYY') AS date,
            TO_CHAR(o.created_at, 'HH12:MI AM') AS time,
            COALESCE(t.table_number, o.id_table, 0) AS "table",
            COALESCE(CAST(o.total_amount AS FLOAT), 0) AS total,
            o.order_status AS status
          FROM orders o
          LEFT JOIN dining_tables t ON o.id_table = t.id_table
          ORDER BY o.id_order DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    async getById(id) {
        const query = `
          SELECT 
            o.id_order AS id,
            COALESCE(o.customer_name, 'Cliente general') AS "customerName",
            COALESCE(u.user_name, 'Mesero asignado') AS waiter,
            TO_CHAR(o.created_at, 'DD/MM/YYYY') AS date,
            TO_CHAR(o.created_at, 'HH12:MI AM') AS time,
            COALESCE(t.table_number, o.id_table, 0) AS "table",
            COALESCE(CAST(o.total_amount AS FLOAT), 0) AS total,
            o.order_status AS status
          FROM orders o
          LEFT JOIN dining_tables t ON o.id_table = t.id_table
          LEFT JOIN usuarios u ON o.id_usuario = u.id_usuario
          WHERE o.id_order = $1;
        `;
        const result = await pool.query(query, [id]);
        const order = result.rows[0];
        if (!order) return null;

        try {
            const detailsQuery = `
              SELECT 
                d.id_order_detail AS id,
                d.id_menu_item AS "productId",
                COALESCE(m.item_name, 'Producto') AS name,
                d.quantity,
                COALESCE(CAST(d.unit_price AS FLOAT), 0) AS price,
                d.notes
              FROM order_details d
              LEFT JOIN menu_items m ON d.id_menu_item = m.id_menu_item
              WHERE d.id_order = $1
              ORDER BY d.id_order_detail ASC;
            `;
            const detailsRes = await pool.query(detailsQuery, [id]);
            order.dishes = detailsRes.rows;
            order.observations = detailsRes.rows[0]?.notes || "";
        } catch {
            order.dishes = [];
            order.observations = "";
        }

        return order;
    },

    async update(id, orderData) {
        const {
            tableNumber,
            customerName,
            orderStatus,
            total = 0,
            items,
            observations,
        } = orderData;

        let resolvedTableId = null;
        if (tableNumber && Number(tableNumber) > 0) {
            const tableRes = await pool.query(
                `INSERT INTO dining_tables (table_number, capacity)
                 VALUES ($1, 4)
                 ON CONFLICT (table_number) DO UPDATE SET table_number = EXCLUDED.table_number
                 RETURNING id_table;`,
                [Number(tableNumber)]
            );
            resolvedTableId = tableRes.rows[0].id_table;
        }

        const query = `
          UPDATE orders SET
            id_table = $1,
            customer_name = $2,
            order_status = COALESCE($3, order_status),
            total_amount = $4
          WHERE id_order = $5
          RETURNING id_order AS id;
        `;

        const result = await pool.query(query, [
            resolvedTableId,
            customerName || "Cliente general",
            orderStatus || null,
            Number(total) || 0,
            id,
        ]);

        const updatedOrder = result.rows[0];

        if (updatedOrder?.id && Array.isArray(items)) {
            await pool.query(`DELETE FROM order_details WHERE id_order = $1`, [id]);

            for (const item of items) {
                const qty = Number(item.quantity) || 1;
                const price = Number(item.price) || 0;
                const menuRes = await pool.query(
                    `SELECT id_menu_item FROM menu_items WHERE item_name ILIKE $1 OR id_menu_item::TEXT = $2 LIMIT 1`,
                    [item.name || "", String(item.productId || "")]
                );
                const fallbackRes = menuRes.rows.length > 0
                    ? menuRes
                    : await pool.query(`SELECT id_menu_item FROM menu_items ORDER BY id_menu_item ASC LIMIT 1`);

                if (fallbackRes.rows.length > 0) {
                    await pool.query(
                        `INSERT INTO order_details (id_order, id_menu_item, quantity, unit_price, subtotal, notes)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [id, fallbackRes.rows[0].id_menu_item, qty, price, qty * price, observations || null]
                    );
                }
            }
        }

        return updatedOrder;
    },

    async updateStatus(id, status) {
        const nextStatus = status || "Deshabilitada";
        const result = await pool.query(
            `UPDATE orders SET order_status = $1 WHERE id_order = $2 RETURNING id_order AS id, order_status AS status;`,
            [nextStatus, id]
        );
        return result.rows[0];
    },

    async disable(id) {
        const result = await pool.query(
            `UPDATE orders SET order_status = 'Deshabilitada' WHERE id_order = $1 RETURNING id_order AS id, order_status AS status;`,
            [id]
        );
        return result.rows[0];
    }
};
