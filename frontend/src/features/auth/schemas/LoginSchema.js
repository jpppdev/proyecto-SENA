import { z } from "zod";

export const loginSchema = z.object({
<<<<<<< Updated upstream
  email: z.string().trim().email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});
=======
  email: z
        .string()
        .trim()
        .email("Correo Invalido -")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, " Debe ingresar un email valido"),

  password: z
        .string()   
        .min(8, "Contraseña debe tener minimo 8 caracteres -")
        .regex(/[A-Z]/, " Debe contener al menos una mayuscula -")
        .regex(/[a-z]/, " Debe contener al menos una minuscula -")
        .regex(/[0-9]/, " Debe contener al menos un numero -")
        .regex(/[^A-Za-z0-9]/, " Debe contener al menos un caracter especial"),
    
});
>>>>>>> Stashed changes
