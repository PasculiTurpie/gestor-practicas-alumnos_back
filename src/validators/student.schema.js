import { z } from "zod";
import { isValidRut } from "../utils/rut.js";

export const studentCreateSchema = z.object({
  fullName: z.string().min(3),
  rut: z.string().refine(isValidRut, "RUT inválido"),
  institutionalEmail: z.string().email(),
  personalEmail: z
    .string()
    .email()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  nrcCode: z.string().min(3),
  phone: z.string().min(7),
  practiceCenter: z.string().min(2),
  observations: z.string().optional(),
});

export const studentUpdateSchema = studentCreateSchema.partial();
