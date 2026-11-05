import { z } from "zod";

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Contraseña debe tener mínimo 8 caracteres -")
      .regex(/[A-Z]/, " Debe contener al menos una mayúscula -")
      .regex(/[a-z]/, " Debe contener al menos una minúscula -")
      .regex(/[0-9]/, " Debe contener al menos un número -")
      .regex(
        /[^A-Za-z0-9]/,
        " Debe contener al menos un carácter especial"
      ),

    confirmPassword: z
      .string()
      .min(8, "Debe confirmar la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });