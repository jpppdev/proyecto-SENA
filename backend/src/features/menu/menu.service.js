// Importamos el repositorio de menu
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { menuRepository } from "./menu.repository.js";

// Exportamos el servicio de menu
// El service representa la capa de logica de negocio de la aplicacion.
export const menuService = {

    // Metodo encargado de crear un plato en el menu.
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (schema)
    async create(data) {

        // Actualmente, el metodo delega directamente al repository
        return await menuRepository.create(data);
    },

    async getAll() {
        return await menuRepository.getAll();
    },

    async getById(id) {
        return await menuRepository.getById(id);
    },

    async update(id, data) {
        return await menuRepository.update(id, data);
    },

    async updateStatus(id, isActive) {
        return await menuRepository.updateStatus(id, isActive);
    },

    async disable(id) {
        return await menuRepository.disable(id);
    },
};
