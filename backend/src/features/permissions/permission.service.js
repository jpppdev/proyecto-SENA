// Importamos el repository de permisos
// El service nunca accede directamente a la base de datos
// siempre delega las operaciones de persistencia al repository.

import { permissionRepository } from "./permission.repository.js";

// Exportamos el servicio de permisos
// La capa service contiene la logica de negocio y validaciones
export const permissionService = {

    // Obtiene roles, permisos por rol, usuarios y permisos por usuario
    async getAll() {
        return await permissionRepository.getAllData();
    },

    // Actualiza los permisos de un rol especifico
    async updateRolePermissions(roleName, permissions) {
        if (!roleName) {
            throw new Error("El rol es obligatorio");
        }
        return await permissionRepository.saveRolePermissions(roleName, permissions || {});
    },

    // Actualiza los permisos especificos de un usuario de la base de datos
    async updateUserPermissions(userId, permissions, roleName) {
        if (!userId) {
            throw new Error("El ID de usuario es obligatorio");
        }
        return await permissionRepository.saveUserPermissions(userId, permissions || {}, roleName);
    }
};

