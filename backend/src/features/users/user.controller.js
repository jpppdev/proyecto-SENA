// Importamos el servicio de usuarios.
//El controller NO implementa logica de negocio,
//solo delega la operacion al service correspondiente.
import { userService } from "./user.service.js";

// Exportamos un objet controlador.
//Agrupar handlers en un objeto permite escalabilidad
//(create, update, delete, getBYID, ETC.)

export const userController = {

    //Metodo encargado de manejar la creacion de un usuario.
    // Se asume que este metodo sera usada como handler de una ruta Express.
    async create(req, res) {

        //log del cuerpo de la peticion
        // Util en desarrollo para validar que el frontend encia correctamente los datos
        // en produccion suele reemplazarse por logging estructurado o eliminarse
        console.log("BODY RECIBIDO", req.body); // CLAVE

        try {
            // llamamos al servicio de usuario, pasando los datos recividos
            // Aqui ocurre la logica real del negocia(validaciones, presistencia, etc.)

            const user = await userService.create(req.body);

            // Respuesta HTTP en caso de exito
            // 201. recurso creado correctamente segun el estadar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message:"Usuario creado correctamente",

                // Retornamos unicamente el ID del usuario creado
                // Evita exponer informacion sensible innesaria
                userId: user.id,
            })

        
        }catch (err) {

            //Captamos cualquier error lanzado por el service o capas inferiores
            //se registra el error completo para depuracion en backend

            console.error("ERROR BACKEND:", err);

            //Respuesta HTTP de error generico
            // 500: error interno del servidor

            res.status(500).json({
                //Se envia el mensaje del error para diagnostico
                // En produccion suele mapearse a mensaje controlados
                error: err.message,

            });
            }
        },
        async getAll(req, res) {
            try {
                const users = await userService.getAll();
                 res.status(200).json(users);
            } catch (err) {
                 console.error("ERROR BACKEND:", err);
                 res.status(500).json({ error: err.message });
            }
        },
        async getById(req, res) {
        try {
            const user = await userService.getById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(user);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
        },
        async update(req, res) {
            try {
                const updated = await userService.update(req.params.id, req.body);
                if (!updated) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }
                res.status(200).json({ message: "Usuario actualizado correctamente", userId: updated.id });
            } catch (err) {
                console.error("ERROR BACKEND:", err);
                res.status(500).json({ error: err.message });
            }
        },
        async updateStatus(req, res) {
            try {
                const { isActive } = req.body || {};
                const updated = await userService.updateStatus(req.params.id, isActive);
                if (!updated) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }
                res.status(200).json({ message: "Estado actualizado correctamente", user: updated });
            } catch (err) {
                console.error("ERROR BACKEND:", err);
                res.status(500).json({ error: err.message });
            }
        },
        async disable(req, res) {
            try {
                const updated = await userService.disable(req.params.id);
                if (!updated) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }
                res.status(200).json({ message: "Usuario deshabilitado correctamente", user: updated });
            } catch (err) {
                console.error("ERROR BACKEND:", err);
                res.status(500).json({ error: err.message });
            }
        },

    };
