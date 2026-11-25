// Importamos el pool de conexion a PostgreSQL
// Este pool es una instancia compartida configurada en la capa infraestructura.

import { pool } from "../../config/db.js";

// Exportamos el repositorio de proveedores
// El repository encapsula todas las consultas SQL relacionadas con suppliers.
export const providerRepository = {

    // Metodo encargado de crear un proveedor en la base de datos.
    // Recibe un objeto con los datos ya validados y procesados por el service.
    async create(providerData) {

        // Desestructuramos explicitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
            providerName,
            documentType,
            documentNumber,
            email,
            phone,
            address,
            isActive = true,
        } = providerData;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (id_supplier)
        const query = `
        INSERT INTO suppliers (
            supplier_name,
            contact_name,
            supplier_email,
            supplier_phone,
            supplier_address,
            is_active
        ) VALUES (
            $1, $2, $3, $4, $5, $6
        ) RETURNING id_supplier AS id;
        `;

        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            providerName,
            documentType && documentNumber ? `${documentType} ${documentNumber}` : null,
            email,
            phone,
            address,
            isActive,
        ];

        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);

        // Devolvemos unicamente el primer registro retornado
        // En este caso contiene el id del proveedor recien creado
        return result.rows[0];
    },

    async getAll() {
        const query = `
          SELECT 
            id_supplier AS id,
            CASE 
              WHEN POSITION(' ' IN COALESCE(contact_name, '')) > 0 THEN SPLIT_PART(contact_name, ' ', 1)
              ELSE 'NIT'
            END AS "documentType",
            CASE 
              WHEN POSITION(' ' IN COALESCE(contact_name, '')) > 0 THEN SUBSTRING(contact_name FROM POSITION(' ' IN contact_name) + 1)
              ELSE COALESCE(contact_name, '00000')
            END AS "documentNumber",
            supplier_name AS "providerName",
            supplier_email AS email,
            supplier_phone AS phone,
            supplier_address AS address,
            COALESCE(contact_name, 'General') AS products,
            is_active AS "isActive"
          FROM suppliers 
          ORDER BY id_supplier DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    async getById(id) {
        const query = `
          SELECT 
            id_supplier AS id,
            CASE 
              WHEN POSITION(' ' IN COALESCE(contact_name, '')) > 0 THEN SPLIT_PART(contact_name, ' ', 1)
              ELSE 'NIT'
            END AS "documentType",
            CASE 
              WHEN POSITION(' ' IN COALESCE(contact_name, '')) > 0 THEN SUBSTRING(contact_name FROM POSITION(' ' IN contact_name) + 1)
              ELSE COALESCE(contact_name, '00000')
            END AS "documentNumber",
            supplier_name AS "providerName",
            supplier_email AS email,
            supplier_phone AS phone,
            supplier_address AS address,
            COALESCE(contact_name, 'General') AS products,
            is_active AS "isActive"
          FROM suppliers 
          WHERE id_supplier = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async update(id, providerData) {
        const {
            providerName,
            documentType,
            documentNumber,
            email,
            phone,
            address,
            isActive = true,
        } = providerData;

        const activeBool = isActive === "true" ? true : isActive === "false" ? false : Boolean(isActive);

        const query = `
          UPDATE suppliers SET
            supplier_name = $1,
            contact_name = $2,
            supplier_email = $3,
            supplier_phone = $4,
            supplier_address = $5,
            is_active = $6
          WHERE id_supplier = $7
          RETURNING id_supplier AS id;
        `;

        const values = [
            providerName,
            documentType && documentNumber ? `${documentType} ${documentNumber}` : documentNumber || null,
            email,
            phone,
            address || null,
            activeBool,
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async updateStatus(id, isActive) {
        const query =
            typeof isActive === "boolean"
                ? `UPDATE suppliers SET is_active = $1 WHERE id_supplier = $2 RETURNING id_supplier AS id, is_active AS "isActive";`
                : `UPDATE suppliers SET is_active = NOT is_active WHERE id_supplier = $1 RETURNING id_supplier AS id, is_active AS "isActive";`;
        const values = typeof isActive === "boolean" ? [isActive, id] : [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async disable(id) {
        const result = await pool.query(
            `UPDATE suppliers SET is_active = FALSE WHERE id_supplier = $1 RETURNING id_supplier AS id, is_active AS "isActive";`,
            [id]
        );
        return result.rows[0];
    }
};
