// Importamos el servicio de productos.
// El controller NO implementa logica de negocio,
// solo delega la operacion al service correspondiente.
import { productService } from "./product.service.js";

// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)

export const productController = {

    // Metodo encargado de manejar la creacion de un producto.
    // Se asume que este metodo sera usado como handler de una ruta Express.
    async create(req, res) {

        // Log del cuerpo de la peticion
        // Util en desarrollo para validar que el frontend envia correctamente los datos
        console.log("BODY RECIBIDO", req.body); // CLAVE

        try {
            // Llamamos al servicio de productos, pasando los datos recibidos
            // Aqui ocurre la logica real del negocio (validaciones, persistencia, etc.)
            const product = await productService.create(req.body);

            // Respuesta HTTP en caso de exito
            // 201: recurso creado correctamente segun el estandar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "Producto creado correctamente",

                // Retornamos unicamente el ID del producto creado
                productId: product.id,
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
            const products = await productService.getAll();
            res.status(200).json(products);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const product = await productService.getById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.status(200).json(product);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },
};
