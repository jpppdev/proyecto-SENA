// Importamos el servicio de permisos
// El controller no contiene logica de negocio ni SQL
// Su responsabilidad es manejar la capa HTTP (req, res)

import { permissionService } from "./permission.service.js";

// Exportamos el controlador de permisos
export const permissionController = {

    // GET /api/permissions
    async getAll(req, res) {
        try {
            const data = await permissionService.getAll();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    },

    // PUT /api/permissions/role/:roleName
    async updateRolePermissions(req, res) {
        try {
            const { roleName } = req.params;
            const { permissions } = req.body;
            const result = await permissionService.updateRolePermissions(roleName, permissions);
            return res.status(200).json({
                message: "Permisos del rol actualizados exitosamente",
                data: result,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }
    },

    // PUT /api/permissions/user/:userId
    async updateUserPermissions(req, res) {
        try {
            const { userId } = req.params;
            const { permissions, roleName } = req.body;
            const result = await permissionService.updateUserPermissions(userId, permissions, roleName);
            return res.status(200).json({
                message: "Permisos específicos del usuario actualizados exitosamente",
                data: result,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }
    }
};

