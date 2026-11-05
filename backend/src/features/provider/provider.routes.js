// Importamos Router desde Express.
// Router permite modularizar las rutas por Feature
// y mantener el archivo principal de la app limpio.

import { Router } from "express";

// Importamos el controller de proveedores
// El router nunca implementa logica,
// solo delega la ejecucion al controller.
import { providerController } from "./provider.controller.js";

// Creamos una instancia del router de Express
const router = Router();

// Definimos la ruta para crear un proveedor
// POST /api/providers
// Cuando se recibe una peticion POST en la raiz del recurso,
// Express ejecuta el metodo create del controller.
router.post(
    "/", 
    providerController.create
);
router.get(
    "/",
    providerController.getAll
);
router.get(
    "/:id",
    providerController.getById
);

// Exportamos el router para ser registrado en la aplicacion principal
// (ej: app.use("/api/providers", router))

export default router;
