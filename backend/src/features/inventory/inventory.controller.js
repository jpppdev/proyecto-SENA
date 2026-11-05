// Importamos el servicio de inventario.
// El controller NO implementa logica de negocio,
// solo delega la operacion al service correspondiente.
import { inventoryService } from "./inventory.service.js";

// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)

export const inventoryController = {

    // Metodo encargado de manejar la creacion de un producto de inventario.
    // Se asume que este metodo sera usado como handler de una ruta Express.
    async create(req, res) {

        // Log del cuerpo de la peticion
        // Util en desarrollo para validar que el frontend envia correctamente los datos
        console.log("BODY RECIBIDO", req.body); // CLAVE

        try {
            // Llamamos al servicio de inventario, pasando los datos recibidos
            // Aqui ocurre la logica real del negocio (validaciones, persistencia, etc.)
            const item = await inventoryService.create(req.body);

            // Respuesta HTTP en caso de exito
            // 201: recurso creado correctamente segun el estandar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "Producto de inventario creado correctamente",

                // Retornamos unicamente el ID del item creado
                itemId: item.id,
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
            const items = await inventoryService.getAll();
            res.status(200).json(items);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const item = await inventoryService.getById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: "Producto de inventario no encontrado" });
            }
            res.status(200).json(item);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },
};
