// backend/src/features/tables/table.repository.js
import { pool } from "../../config/db.js";

const ACTIVE_ORDER_STATUSES = ["pending", "pendiente", "en preparación", "en preparacion"];

async function ensureTableColumns() {
  await pool.query(`
    ALTER TABLE dining_tables
      ADD COLUMN IF NOT EXISTS table_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS zone VARCHAR(100);
  `);
}

function mapTableRow(row, activeOrders = []) {
  const normalizedDbStatus = String(row.status || "available").trim().toLowerCase();
  const computedStatus =
    activeOrders.length > 0
      ? "occupied"
      : ["available", "occupied", "reserved"].includes(normalizedDbStatus)
      ? normalizedDbStatus
      : "available";

  return {
    id: row.id,
    number: row.number,
    name: row.name?.trim() || `Mesa ${row.number}`,
    zone: row.zone?.trim() || null,
    capacity: Number(row.capacity) || 0,
    status: computedStatus,
    isActive: row.isActive !== false,
    activeOrders,
  };
}

export const tableRepository = {
  async getAll() {
    await ensureTableColumns();

    const tablesResult = await pool.query(`
      SELECT
        id_table AS id,
        table_number AS number,
        table_name AS name,
        zone,
        capacity,
        status,
        is_active AS "isActive"
      FROM dining_tables
      WHERE is_active = TRUE
      ORDER BY table_number ASC;
    `);

    const ordersResult = await pool.query(
      `
      SELECT
        o.id_order AS id,
        o.id_table AS "tableId",
        COALESCE(t.table_number, o.id_table) AS "tableNumber",
        COALESCE(o.customer_name, 'Cliente general') AS "customerName",
        o.order_status AS status,
        COALESCE(CAST(o.total_amount AS FLOAT), 0) AS total,
        TO_CHAR(o.created_at, 'DD/MM/YYYY') AS date,
        TO_CHAR(o.created_at, 'HH12:MI AM') AS time
      FROM orders o
      LEFT JOIN dining_tables t ON o.id_table = t.id_table
      WHERE LOWER(TRIM(COALESCE(o.order_status, ''))) = ANY($1::text[])
      ORDER BY o.id_order DESC;
      `,
      [ACTIVE_ORDER_STATUSES]
    );

    const ordersByTableId = new Map();
    for (const order of ordersResult.rows) {
      const key = order.tableId ?? order.tableNumber;
      if (key == null) continue;
      if (!ordersByTableId.has(key)) {
        ordersByTableId.set(key, []);
      }
      ordersByTableId.get(key).push({
        id: order.id,
        customerName: order.customerName,
        status: order.status,
        total: order.total,
        date: order.date,
        time: order.time,
      });
    }

    return tablesResult.rows.map((row) =>
      mapTableRow(row, ordersByTableId.get(row.id) ?? [])
    );
  },

  async getById(id) {
    await ensureTableColumns();

    const tableResult = await pool.query(
      `
      SELECT
        id_table AS id,
        table_number AS number,
        table_name AS name,
        zone,
        capacity,
        status,
        is_active AS "isActive"
      FROM dining_tables
      WHERE id_table = $1
      LIMIT 1;
      `,
      [id]
    );

    const row = tableResult.rows[0];
    if (!row) return null;

    const ordersResult = await pool.query(
      `
      SELECT
        id_order AS id,
        COALESCE(customer_name, 'Cliente general') AS "customerName",
        order_status AS status,
        COALESCE(CAST(total_amount AS FLOAT), 0) AS total,
        TO_CHAR(created_at, 'DD/MM/YYYY') AS date,
        TO_CHAR(created_at, 'HH12:MI AM') AS time
      FROM orders
      WHERE id_table = $1
        AND LOWER(TRIM(COALESCE(order_status, ''))) = ANY($2::text[])
      ORDER BY id_order DESC;
      `,
      [id, ACTIVE_ORDER_STATUSES]
    );

    return mapTableRow(row, ordersResult.rows);
  },

  async findByNumber(tableNumber) {
    const result = await pool.query(
      `
      SELECT id_table AS id, table_number AS number, is_active AS "isActive"
      FROM dining_tables
      WHERE table_number = $1
      LIMIT 1;
      `,
      [tableNumber]
    );
    return result.rows[0] || null;
  },

  async create(tableData) {
    await ensureTableColumns();

    const { number, name, zone, capacity, status = "available" } = tableData;

    const existing = await this.findByNumber(number);
    if (existing) {
      if (existing.isActive) {
        const err = new Error(`Ya existe una mesa activa con el número ${number}`);
        err.statusCode = 409;
        throw err;
      }

      // Si existía una mesa deshabilitada con ese número, la reactivamos con los nuevos datos
      const reactivated = await pool.query(
        `
        UPDATE dining_tables
        SET table_name = $1,
            zone = $2,
            capacity = $3,
            status = $4,
            is_active = TRUE
        WHERE id_table = $5
        RETURNING id_table AS id;
        `,
        [name || `Mesa ${number}`, zone || null, capacity, status, existing.id]
      );
      return this.getById(reactivated.rows[0].id);
    }

    const inserted = await pool.query(
      `
      INSERT INTO dining_tables (table_number, table_name, zone, capacity, status, is_active)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING id_table AS id;
      `,
      [number, name || `Mesa ${number}`, zone || null, capacity, status]
    );

    return this.getById(inserted.rows[0].id);
  },

  async update(id, tableData) {
    await ensureTableColumns();

    const { number, name, zone, capacity, status } = tableData;

    if (number !== undefined) {
      const existing = await this.findByNumber(number);
      if (existing && String(existing.id) !== String(id)) {
        const err = new Error(`Ya existe otra mesa con el número ${number}`);
        err.statusCode = 409;
        throw err;
      }
    }

    const updated = await pool.query(
      `
      UPDATE dining_tables
      SET table_number = COALESCE($1, table_number),
          table_name = COALESCE($2, table_name),
          zone = $3,
          capacity = COALESCE($4, capacity),
          status = COALESCE($5, status)
      WHERE id_table = $6
      RETURNING id_table AS id;
      `,
      [
        number ?? null,
        name ?? null,
        zone !== undefined ? zone || null : null,
        capacity ?? null,
        status ?? null,
        id,
      ]
    );

    if (!updated.rows[0]) return null;
    return this.getById(updated.rows[0].id);
  },

  async updateStatus(id, status) {
    const updated = await pool.query(
      `
      UPDATE dining_tables
      SET status = $1
      WHERE id_table = $2
      RETURNING id_table AS id;
      `,
      [status, id]
    );
    if (!updated.rows[0]) return null;
    return this.getById(updated.rows[0].id);
  },

  async release(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const tableRes = await client.query(
        `
        UPDATE dining_tables
        SET status = 'available'
        WHERE id_table = $1
        RETURNING id_table AS id;
        `,
        [id]
      );

      if (!tableRes.rows[0]) {
        await client.query("ROLLBACK");
        return null;
      }

      await client.query(
        `
        UPDATE orders
        SET order_status = 'Completada'
        WHERE id_table = $1
          AND LOWER(TRIM(COALESCE(order_status, ''))) = ANY($2::text[]);
        `,
        [id, ACTIVE_ORDER_STATUSES]
      );

      await client.query("COMMIT");
      return this.getById(id);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async disable(id) {
    const result = await pool.query(
      `
      UPDATE dining_tables
      SET is_active = FALSE
      WHERE id_table = $1
      RETURNING id_table AS id, is_active AS "isActive";
      `,
      [id]
    );
    return result.rows[0] || null;
  },
};
