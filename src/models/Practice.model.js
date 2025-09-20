import mongoose from "mongoose";

const StageHistorySchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      enum: [
        "RECOPILACION_Y_CARPETA",
        "ENTREGA_CARPETA",
        "ENCUESTA_CP",
        "ENVIO_PORTAFOLIO_INSTRUCCIONES",
        "SUPERVISION_PRACTICAS",
        "ENVIO_BORRADOR_PORTAFOLIO",
        "SUBIR_PORTAFOLIO_AULA",
        "NOTA_FINAL_CIERRE",
      ],
      required: true,
    },
    status: { type: String, enum: ["pending", "done"], default: "done" },
    notes: { type: String },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PracticeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    currentStage: {
      type: String,
      enum: [
        "RECOPILACION_Y_CARPETA",
        "ENTREGA_CARPETA",
        "ENCUESTA_CP",
        "ENVIO_PORTAFOLIO_INSTRUCCIONES",
        "SUPERVISION_PRACTICAS",
        "ENVIO_BORRADOR_PORTAFOLIO",
        "SUBIR_PORTAFOLIO_AULA",
        "NOTA_FINAL_CIERRE",
      ],
      default: "RECOPILACION_Y_CARPETA",
    },
    stageHistory: { type: [StageHistorySchema], default: [] },
    finalGrade: { type: Number, min: 1, max: 7 },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

export const Practice = mongoose.model("Practice", PracticeSchema);
