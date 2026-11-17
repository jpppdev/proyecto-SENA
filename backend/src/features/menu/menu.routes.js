// Importamos Router desde Express.
// Router permite modularizar las rutas por Feature
// y mantener el archivo principal de la app limpio.

import { Router } from "express";

// Importamos el controller de menu
// El router nunca implementa logica,
// solo delega la ejecucion al controller.
import { menuController } from "./menu.controller.js";

// Creamos una instancia del router de Express
const router = Router();

// Definimos la ruta para crear un plato del menu
// POST /api/menu
// Cuando se recibe una peticion POST en la raiz del recurso,
// Express ejecuta el metodo create del controller.
router.post(
    "/", 
    menuController.create
);
router.get(
    "/",
    menuController.getAll
);
router.get(
    "/:id",
    menuController.getById
);
router.put(
    "/:id",
    menuController.update
);
router.patch(
    "/:id/status",
    menuController.updateStatus
);
router.patch(
    "/:id/disable",
    menuController.disable
);
router.delete(
    "/:id",
    menuController.disable
);

// Exportamos el router para ser registrado en la aplicacion principal
// (ej: app.use("/api/menu", router))

export default router;
