// Importamos Router desde Express.
// Router permite modularizar las rutas por Feature
// y mantener el archivo principal de la app limpio.

import { Router } from "express";

// Importamos el controller de usuarios
// El router nunca implementa logica,
// solo delega la ejecuccion al controller.
import { userController } from "./user.controller.js";

// Creamos una instancia del router de Express
const router = Router();

// Definimos la ruta para crear un usuario
// POST /users
// Cuando  se recibe una peticion POST en la raiz del recurso,
// Express ejecuta el metodo create del controller.
router.post(
    "/", 
    userController.create
);
router.get(
    "/",
    userController.getAll
);
router.get(
    "/:id",
    userController.getById
)
// Exportamos el router ára ser registrado en la aplicacion principal
//(eje: app.use("/users", router))

export default router;
