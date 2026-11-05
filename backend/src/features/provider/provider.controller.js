// Importamos el servicio de proveedores.
// El controller NO implementa logica de negocio,
// solo delega la operacion al service correspondiente.
import { providerService } from "./provider.service.js";

// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)

export const providerController = {

    // Metodo encargado de manejar la creacion de un proveedor.
    // Se asume que este metodo sera usado como handler de una ruta Express.
    async create(req, res) {

        // Log del cuerpo de la peticion
        // Util en desarrollo para validar que el frontend envia correctamente los datos
        console.log("BODY RECIBIDO", req.body); // CLAVE

        try {
            // Llamamos al servicio de proveedores, pasando los datos recibidos
            // Aqui ocurre la logica real del negocio (validaciones, persistencia, etc.)
            const provider = await providerService.create(req.body);

            // Respuesta HTTP en caso de exito
            // 201: recurso creado correctamente segun el estandar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "Proveedor creado correctamente",

                // Retornamos unicamente el ID del proveedor creado
                providerId: provider.id,
            });

        } catch (err) {

            // Capturamos cualquier error lanzado por el service o capas inferiores
            // Se registra el error completo para depuracion en backend
            console.error("ERROR BACKEND:", err);

            // Respuesta HTTP de error generico
            // 500: error interno del servidor
            res.status(500).json({
                // Se envia el mensaje del error para diagnostico
                error: err.message,
            });
        }
    },

    async getAll(req, res) {
        try {
            const providers = await providerService.getAll();
            res.status(200).json(providers);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const provider = await providerService.getById(req.params.id);
            if (!provider) {
                return res.status(404).json({ message: "Proveedor no encontrado" });
            }
            res.status(200).json(provider);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },
};
