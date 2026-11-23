// Importamos Router desde Express.
// Router permite modularizar las rutas por Feature
// y mantener el archivo principal de la app limpio.

import { Router } from "express";

// Importamos el controller de ordenes
// El router nunca implementa logica,
// solo delega la ejecucion al controller.
import { orderController } from "./order.controller.js";

// Creamos una instancia del router de Express
const router = Router();

// Definimos la ruta para crear una orden
// POST /api/orders
// Cuando se recibe una peticion POST en la raiz del recurso,
// Express ejecuta el metodo create del controller.
router.post(
    "/", 
    orderController.create
);
router.get(
    "/",
    orderController.getAll
);
router.get(
    "/:id",
    orderController.getById
);
router.put(
    "/:id",
    orderController.update
);
router.patch(
    "/:id/status",
    orderController.updateStatus
);
router.patch(
    "/:id/disable",
    orderController.disable
);
router.delete(
    "/:id",
    orderController.disable
);

// Exportamos el router para ser registrado en la aplicacion principal
// (ej: app.use("/api/orders", router))

export default router;
