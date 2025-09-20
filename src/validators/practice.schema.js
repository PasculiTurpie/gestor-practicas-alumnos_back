import { z } from "zod";

export const STAGES = [
  "RECOPILACION_Y_CARPETA",
  "ENTREGA_CARPETA",
  "ENCUESTA_CP",
  "ENVIO_PORTAFOLIO_INSTRUCCIONES",
  "SUPERVISION_PRACTICAS",
  "ENVIO_BORRADOR_PORTAFOLIO",
  "SUBIR_PORTAFOLIO_AULA",
  "NOTA_FINAL_CIERRE",
];

export const practiceCreateSchema = z.object({
  studentId: z.string().min(1),
  currentStage: z.enum(STAGES).default("RECOPILACION_Y_CARPETA"),
});

export const practiceAdvanceSchema = z.object({
  nextStage: z.enum(STAGES),
  notes: z.string().optional(),
});
