// importamos el repositorio de usuarios
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import bcrypt from "bcrypt";
import { userRepository } from "./user.repository.js";

const SALT_ROUNDS = 12;

async function hashPasswordIfNeeded(rawPassword) {
    const password = String(rawPassword || "");
    if (!password.trim()) return null;
    if (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$")) {
        return password;
    }
    return await bcrypt.hash(password, SALT_ROUNDS);
}

// Exportamos el servicio de usuarios
// EL service representa  la capa de logica de negocio de la aplicacion.
export const userService = {

    //Metido encargado de crear un usuario.
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (schema)
    async create(data) {
        const rawPassword = data?.userPassword ?? data?.password;
        const hashedPassword = await hashPasswordIfNeeded(rawPassword);

        if (!hashedPassword) {
            throw new Error("La contraseña es requerida");
        }

        return await userRepository.create({
            ...data,
            userPassword: hashedPassword,
        });
    },

    async getAll(){
        return await userRepository.getAll()
    },
    async getById(id) {
        return await userRepository.getById(id);
    },
    async update(id, data) {
        const rawPassword = data?.userPassword ?? data?.password;
        const hashedPassword = await hashPasswordIfNeeded(rawPassword);

        return await userRepository.update(id, {
            ...data,
            userPassword: hashedPassword || undefined,
        });
    },
    async updateStatus(id, isActive) {
        return await userRepository.updateStatus(id, isActive);
    },
    async disable(id) {
        return await userRepository.disable(id);
    },
};
