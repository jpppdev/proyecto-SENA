// Importamos el repositorio de proveedores
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { providerRepository } from "./provider.repository.js";

// Exportamos el servicio de proveedores
// El service representa la capa de logica de negocio de la aplicacion.
export const providerService = {

    // Metodo encargado de crear un proveedor.
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (schema)
    async create(data) {

        // Actualmente, el metodo delega directamente al repository
        return await providerRepository.create(data);
    },

    async getAll() {
        return await providerRepository.getAll();
    },

    async getById(id) {
        return await providerRepository.getById(id);
    },

    async update(id, data) {
        return await providerRepository.update(id, data);
    },

    async updateStatus(id, isActive) {
        return await providerRepository.updateStatus(id, isActive);
    },

    async disable(id) {
        return await providerRepository.disable(id);
    },
};
