// Importamos el servicio de ordenes.
// El controller NO implementa logica de negocio,
// solo delega la operacion al service correspondiente.
import { orderService } from "./order.service.js";

// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)

export const orderController = {

    // Metodo encargado de manejar la creacion de una orden.
    // Se asume que este metodo sera usado como handler de una ruta Express.
    async create(req, res) {

        // Log del cuerpo de la peticion
        // Util en desarrollo para validar que el frontend envia correctamente los datos
        console.log("BODY RECIBIDO", req.body); // CLAVE

        try {
            // Llamamos al servicio de ordenes, pasando los datos recibidos
            // Aqui ocurre la logica real del negocio (validaciones, persistencia, etc.)
            const order = await orderService.create(req.body);

            // Respuesta HTTP en caso de exito
            // 201: recurso creado correctamente segun el estandar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "Orden creada correctamente",

                // Retornamos unicamente el ID de la orden creada
                orderId: order.id,
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
            const orders = await orderService.getAll();
            res.status(200).json(orders);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const order = await orderService.getById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: "Orden no encontrada" });
            }
            res.status(200).json(order);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },
};
