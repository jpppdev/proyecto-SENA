// Importamos el paquete "pg" usando el sistema de modulos ES. // importamos el paquete SQL para node.js

import pkg from "pg";

// Extraemos la clase Pool desde el paquete.
// Pool gestiona un conjunto de conexiones reutilizables a la BD.

const { Pool } = pkg;

// Importamos detonv para poder leer variables de entorno desde un archivo.env
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

//Cargamos las variables de entorno desde el archivo .env

// Esto debe ejecutarse antes de acceder a process.env
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)), quiet: true });

// Creamos y exportamos una instancia unica del Pool de PostgreSQL
// Esta instancia se reutiliza en toda la aplicacion
export const pool = new Pool({
    // Host donde se encuentra PostgreSQL (ej: locarlhost o IP del servidor)
    host: process.env.DB_HOST,


    // PUerta de PostgreSQL (por defecto 5432)
    port: process.env.DB_PORT,

    // Usuario con permisos sobre la base de datos
    user: process.env.DB_USER,

    // Contraseña del usuario
    password: process.env.DB_PASSWORD,

    // Nombre de la base de datos a la que nos conectaremos
    database: process.env.DB_NAME,

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

