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
        orderType,
        idUsuario,
        customerName,
        orderStatus = "En preparación",
        total = 0,
    } = orderData;

    const needsTable = orderType === "mesa";
    const hasTable = tableNumber != null && tableNumber !== "";
    const resolvedTableId = needsTable || (!orderType && hasTable)
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
        total_amount,
        order_type
    ) VALUES (
        $1,
        COALESCE($2, (SELECT id_usuario FROM usuarios ORDER BY id_usuario ASC LIMIT 1)),
        $3,
        $4,
        $5,
        $6
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
        orderType || null,
    ];

    // Ejecutamos la consulta usando el pool
    // client.query retorna un objeto con metadata y filas resultantes
    const result = await client.query(query, values);
    const createdOrder = result.rows[0];

    // Si vienen items en la orden, los guardamos en order_details
    if (createdOrder?.id && Array.isArray(orderData.items)) {
        await insertOrderDetails(client, createdOrder.id, orderData.items, orderData.observations);
    }

    return createdOrder;
}

async function insertOrderDetails(client, orderId, items, observations, existingProducts = []) {
    for (const item of items) {
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
             FROM menu_items WHERE id_menu_item = $2 AND (is_active IS TRUE OR id_menu_item = ANY($7::int[]))`,
            [orderId, productId, quantity, price, quantity * price, observations || null, existingProducts]
        );
        if (!detail.rowCount) {
            throw Object.assign(new Error("Un producto ya no está disponible. Retíralo de la orden y vuelve a intentarlo."), { status: 422 });
        }
    }
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

    async getAll(includeDetails = false) {
        const query = `
          SELECT
            o.id_order AS id,
            COALESCE(o.customer_name, 'Cliente general') AS "customerName",
            u.user_name AS waiter,
            EXTRACT(EPOCH FROM (LOCALTIMESTAMP - o.created_at))::integer AS "ageSeconds",
            TO_CHAR(o.created_at, 'DD/MM/YYYY') AS date,
            TO_CHAR(o.created_at, 'HH12:MI AM') AS time,
            COALESCE(t.table_number, o.id_table, 0) AS "table",
            COALESCE(CAST(o.total_amount AS FLOAT), 0) AS total,
            o.order_status AS status
            ${includeDetails ? `, o.order_type AS "orderType",
            COALESCE(details.dishes, '[]'::jsonb) AS dishes` : ""}
          FROM orders o
          LEFT JOIN dining_tables t ON o.id_table = t.id_table
          LEFT JOIN usuarios u ON o.id_usuario = u.id_usuario
          ${includeDetails ? `LEFT JOIN (
            SELECT d.id_order, jsonb_agg(
                jsonb_build_object('name', COALESCE(m.item_name, 'Producto'), 'quantity', d.quantity)
                ORDER BY d.id_order_detail
            ) AS dishes
            FROM order_details d
            LEFT JOIN menu_items m ON m.id_menu_item = d.id_menu_item
            GROUP BY d.id_order
          ) details ON details.id_order = o.id_order` : ""}
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
            o.order_type AS "orderType",
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

        const detailsQuery = `
          SELECT
            d.id_order_detail AS id,
            d.id_menu_item AS "productId",
            COALESCE(m.item_name, 'Producto') AS name,
            m.image_url AS image,
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

        return order;
    },

    async update(id, orderData) {
        const {
            tableNumber,
            orderType,
            customerName,
            orderStatus,
            total = 0,
            items,
            observations,
        } = orderData;

        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const { rows: [current] } = await client.query(
                `SELECT o.id_table, t.table_number
                 FROM orders o LEFT JOIN dining_tables t ON t.id_table = o.id_table
                 WHERE o.id_order = $1 FOR UPDATE OF o`,
                [id]
            );
            if (!current) {
                await client.query("ROLLBACK");
                return null;
            }

            let resolvedTableId = null;
            if (orderType === "mesa" || (!orderType && Number(tableNumber) > 0)) {
                resolvedTableId = current.id_table && current.table_number === Number(tableNumber)
                    ? current.id_table
                    : await lockAvailableTable(client, tableNumber);
            }

            const { rows: [updatedOrder] } = await client.query(
                `UPDATE orders SET
                    id_table = $1,
                    customer_name = $2,
                    order_status = COALESCE($3, order_status),
                    total_amount = $4,
                    order_type = COALESCE($5, order_type)
                 WHERE id_order = $6
                 RETURNING id_order AS id`,
                [resolvedTableId, customerName || "Cliente general", orderStatus || null, Number(total) || 0, orderType || null, id]
            );

            if (Array.isArray(items)) {
                const { rows: previous } = await client.query(
                    "DELETE FROM order_details WHERE id_order = $1 RETURNING id_menu_item",
                    [id]
                );
                await insertOrderDetails(client, id, items, observations, previous.map(({ id_menu_item }) => id_menu_item));
            }

            await client.query("COMMIT");
            return updatedOrder;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
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
