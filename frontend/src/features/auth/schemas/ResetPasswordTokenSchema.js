import { z } from "zod";

export const resetPasswordTokenSchema = z
  .object({
    token: z
      .string()
      .min(4, "El Token debe tener mínimo 4 caracteres -")
      .max(4, " El Token debe tener maximo 4 caracteres")
  });