// Importamos el repositorio de ordenes
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { orderRepository } from "./order.repository.js";

// Exportamos el servicio de ordenes
// El service representa la capa de logica de negocio de la aplicacion.
export const orderService = {

    // Metodo encargado de crear una orden.
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (schema)
    async create(data) {

        // Actualmente, el metodo delega directamente al repository
        return await orderRepository.create(data);
    },

    async getAll() {
        return await orderRepository.getAll();
    },

    async getById(id) {
        return await orderRepository.getById(id);
    },
};
