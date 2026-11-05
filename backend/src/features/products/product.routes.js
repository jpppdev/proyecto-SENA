// Importamos Router desde Express.
// Router permite modularizar las rutas por Feature
// y mantener el archivo principal de la app limpio.

import { Router } from "express";

// Importamos el controller de productos
// El router nunca implementa logica,
// solo delega la ejecucion al controller.
import { productController } from "./product.controller.js";

// Creamos una instancia del router de Express
const router = Router();

// Definimos la ruta para crear un producto
// POST /api/products
// Cuando se recibe una peticion POST en la raiz del recurso,
// Express ejecuta el metodo create del controller.
router.post(
    "/", 
    productController.create
);
router.get(
    "/",
    productController.getAll
);
router.get(
    "/:id",
    productController.getById
);

// Exportamos el router para ser registrado en la aplicacion principal
// (ej: app.use("/api/products", router))

export default router;
