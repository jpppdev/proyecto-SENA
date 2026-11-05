// src/features/users/schemas/userSchema.js

import { z } from "zod";
import { fileSchema } from "@/shared/schemas/fileSchema";

export const userSchema = z.object({
    
    userName: z
        .string()
        .min(3, "El nombre debe de tener mínimo 3 caracteres")
        .max(60, "El nombre es demasiado largo"),

    userLastName: z
        .string()
        .min(2, "El apellido es requerido"),

    userEmail: z
        .email()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email valido"),

    businessEmail: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.string().email("Debe ingresar un email empresarial válido").optional()
    ),

    userPhone: z
        .string()
        .regex(/^\d{10}$/, "El número de teléfono debe tener 10 dígitos"),

    userDocumentTypes: z.string().min(1, "El tipo de documento es requerido"),

    userDocumentNumber: z
        .string()
        .min(5, "El número de documento debe tener al menos 5 caracteres")
        .max(20, "El número de documento es demasiado largo"),

    startDate: z.string().min(1, "La fecha de inicio es requerida"),
    endDate: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),
    address: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),
    role: z.string().min(1, "El rol es requerido"),

    userPassword: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
        .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),

    // NINGÚN PREPROCESS AQUÍ: 
    // Obligamos a que pase por la validación de archivos de tu compañero/profesor
    userImage: fileSchema.shape.files,

    userAvatarUrl: z
        .string()
        .url("La URL del avatar no es válida")
        .nullable()
        .optional(),

    isActive: z.preprocess(
        (value) => (value === "true" ? true : value === "false" ? false : value),
        z.boolean()
    ),

    isStaff: z.preprocess(
        (value) => (value === "true" ? true : value === "false" ? false : value),
        z.boolean()
    ),

    isSuperUser: z.preprocess(
        (value) => (value === "true" ? true : value === "false" ? false : value),
        z.boolean()
    ),
});