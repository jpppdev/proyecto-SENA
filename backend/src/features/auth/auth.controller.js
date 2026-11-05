// backend/src/features/auth/auth.controller.js
import { authService } from "./auth.service.js";

export const authController = {
  async login(req, res) {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        message: "Login exitoso",
        ...result, // Sin espacio después de los tres puntos
      });
    } catch (err) {
      res.status(401).json({ // Sin espacio entre res. y status
        error: err.message,
      });
    }
  },
};