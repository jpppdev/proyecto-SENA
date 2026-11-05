// Importamos el repositorio de productos
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { productRepository } from "./product.repository.js";

// Exportamos el servicio de productos
// El service representa la capa de logica de negocio de la aplicacion.
export const productService = {

    // Metodo encargado de crear un producto.
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (schema)
    async create(data) {

        // Actualmente, el metodo delega directamente al repository
        return await productRepository.create(data);
    },

    async getAll() {
        return await productRepository.getAll();
    },

    async getById(id) {
        return await productRepository.getById(id);
    },
};
