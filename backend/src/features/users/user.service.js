// importamos el repositorio de usuarios
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { userRepository } from "./user.repository.js";

// Exportamos el servicio de usuarios
// EL service representa  la capa de logica de negocio de la aplicacion.
export const userService = {

    //Metido encargado de crear un usuario.
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (schema)
    async create(data) {

        // En este punto, en una arquitectura real, deberia ocurrir:
        //-Validaciones de reglas de negocio
        //-Transformaciones (ej: hash de contraseñas)
        //-Vereficaciones unicidad( email, documento, etc.)
        //-Decisiones de negocio (roles, flags, estados inicales)

        //Actualmente, el metodo solo delega directamente al repository
        // sin agregar ninguna logica adicional.
        return await userRepository.create(data);
    },

    async getAll(){
        return await userRepository.getAll()
    },
    async getById(id) {
        return await userRepository.getById(id);
    },
    async update(id, data) {
        return await userRepository.update(id, data);
    },
    async updateStatus(id, isActive) {
        return await userRepository.updateStatus(id, isActive);
    },
    async disable(id) {
        return await userRepository.disable(id);
    },
};
