import app from "./app.js";
import { pool } from "./config/db.js";
import { initDatabaseTables } from "./config/initDatabase.js";

const PORT = process.env.PORT || 4000;
try {
    await initDatabaseTables();
    app.listen(PORT, () => {
        console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("No se pudo preparar PostgreSQL. Revisa backend/.env y que la base exista.", error.message);
    await pool.end();
    process.exitCode = 1;
}