// Importamos el servicio de menu.
// El controller NO implementa logica de negocio,
// solo delega la operacion al service correspondiente.
import { menuService } from "./menu.service.js";

// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)

export const menuController = {

    // Metodo encargado de manejar la creacion de un plato del menu.
    // Se asume que este metodo sera usado como handler de una ruta Express.
    async create(req, res) {

        // Log del cuerpo de la peticion
        // Util en desarrollo para validar que el frontend envia correctamente los datos
        console.log("BODY RECIBIDO", req.body); // CLAVE

        try {
            // Llamamos al servicio de menu, pasando los datos recibidos
            // Aqui ocurre la logica real del negocio (validaciones, persistencia, etc.)
            const menuItem = await menuService.create(req.body);

            // Respuesta HTTP en caso de exito
            // 201: recurso creado correctamente segun el estandar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "Plato del menú creado correctamente",

                // Retornamos unicamente el ID del plato creado
                menuId: menuItem.id,
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
            const menuItems = await menuService.getAll();
            res.status(200).json(menuItems);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const menuItem = await menuService.getById(req.params.id);
            if (!menuItem) {
                return res.status(404).json({ message: "Plato no encontrado" });
            }
            res.status(200).json(menuItem);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const updated = await menuService.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: "Plato no encontrado" });
            }
            res.status(200).json({ message: "Plato actualizado correctamente", menuId: updated.id });
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const { isActive } = req.body || {};
            const updated = await menuService.updateStatus(req.params.id, isActive);
            if (!updated) {
                return res.status(404).json({ message: "Plato no encontrado" });
            }
            res.status(200).json({ message: "Estado del plato actualizado correctamente", menuItem: updated });
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async disable(req, res) {
        try {
            const updated = await menuService.disable(req.params.id);
            if (!updated) {
                return res.status(404).json({ message: "Plato no encontrado" });
            }
            res.status(200).json({ message: "Plato deshabilitado correctamente", menuItem: updated });
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },
};
