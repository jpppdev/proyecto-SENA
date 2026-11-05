import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
        .string()
        .email("Correo Invalido -")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email valido"),
});