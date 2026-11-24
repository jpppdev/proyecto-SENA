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
      console.error("ERROR EN LOGIN BACKEND:", err);
      const errorMessage =
        err.code === "ECONNREFUSED" || err.code === "EACCES"
          ? "Error de conexión con la base de datos PostgreSQL"
          : err.message || "Credenciales inválidas";

      res.status(401).json({ // Sin espacio entre res. y status
        error: errorMessage,
        message: errorMessage,
      });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body || {};
      const result = await authService.forgotPassword(email);
      res.status(200).json(result);
    } catch (err) {
      console.error("ERROR EN FORGOT PASSWORD:", err);
      res.status(400).json({
        error: err.message || "Error al enviar el código de recuperación",
      });
    }
  },

  async verifyResetToken(req, res) {
    try {
      const { email, token } = req.body || {};
      const result = await authService.verifyResetToken({ email, token });
      res.status(200).json(result);
    } catch (err) {
      console.error("ERROR EN VERIFY TOKEN:", err);
      res.status(400).json({
        error: err.message || "Código inválido o expirado",
      });
    }
  },

  async resetPassword(req, res) {
    try {
      const { email, token, password } = req.body || {};
      const result = await authService.resetPassword({ email, token, password });
      res.status(200).json(result);
    } catch (err) {
      console.error("ERROR EN RESET PASSWORD:", err);
      res.status(400).json({
        error: err.message || "Error al restablecer la contraseña",
      });
    }
  },
};