// Importamos Router desde Express.
// Router permite modularizar las rutas por Feature
// y mantener el archivo principal de la app limpio.

import { Router } from "express";

// Importamos el controller de inventario
// El router nunca implementa logica,
// solo delega la ejecucion al controller.
import { inventoryController } from "./inventory.controller.js";

// Creamos una instancia del router de Express
const router = Router();

// Definimos la ruta para crear un item de inventario
// POST /api/inventory
// Cuando se recibe una peticion POST en la raiz del recurso,
// Express ejecuta el metodo create del controller.
router.post(
    "/", 
    inventoryController.create
);
router.get(
    "/",
    inventoryController.getAll
);
router.get(
    "/:id",
    inventoryController.getById
);

// Exportamos el router para ser registrado en la aplicacion principal
// (ej: app.use("/api/inventory", router))

export default router;
