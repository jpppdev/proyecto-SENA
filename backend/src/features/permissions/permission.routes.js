// Importamos Router desde express
// Router permite definir rutas modulares desacopladas de app.js
import { Router } from "express";

// Importamos el controlador de permisos
// El archivo de rutas solo conecta endpoints HTTP con metodos del controller
import { permissionController } from "./permission.controller.js";

// Creamos una instancia de router para el feature permissions
const router = Router();

// Definicion de endpoints para /api/permissions
router.get("/", permissionController.getAll);
router.put("/role/:roleName", permissionController.updateRolePermissions);
router.put("/user/:userId", permissionController.updateUserPermissions);

// Exportamos el router para ser montado en app.js
export default router;

