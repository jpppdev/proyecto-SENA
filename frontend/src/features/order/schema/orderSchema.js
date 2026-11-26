import { z } from "zod";

export const orderSchema = z.object({
  customerName: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .optional()
    .or(z.literal("")), // Permite que esté vacío si es un cliente casual

  orderType: z
    .string()
    .min(1, "Seleccione el tipo de orden"),

  tableNumber: z
    .string()
    .regex(/^\d*$/, "El número de mesa debe ser numérico")
    .optional(),

  paymentMethod: z
    .string()
    .min(1, "Seleccione un método de pago"),

  observations: z
    .string()
    .max(200, "Las observaciones no pueden exceder los 200 caracteres")
    .optional(),
});

export const createOrderSchema = orderSchema.omit({ paymentMethod: true });
