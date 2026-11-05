// Importamos el repositorio de inventario
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { inventoryRepository } from "./inventory.repository.js";

// Exportamos el servicio de inventario
// El service representa la capa de logica de negocio de la aplicacion.
export const inventoryService = {

    // Metodo encargado de crear un item en inventario.
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (schema)
    async create(data) {

        // Actualmente, el metodo delega directamente al repository
        return await inventoryRepository.create(data);
    },

    async getAll() {
        return await inventoryRepository.getAll();
    },

    async getById(id) {
        return await inventoryRepository.getById(id);
    },
};
