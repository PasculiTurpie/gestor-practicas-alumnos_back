import mongoose from "mongoose";
import { cleanRut } from "../utils/rut.js";

const StudentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    rut: { type: String, required: true, unique: true, uppercase: true }, // se guardará limpio + uppercase
    institutionalEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    personalEmail: { type: String, lowercase: true, trim: true },
    nrcCode: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    practiceCenter: { type: String, required: true, trim: true },
    observations: { type: String, trim: true },
  },
  { timestamps: true }
);

StudentSchema.index({
  fullName: "text",
  nrcCode: "text",
  practiceCenter: "text",
});

// 🔒 Normaliza en pre-validate / pre-save
StudentSchema.pre("validate", function (next) {
  if (this.rut) this.rut = cleanRut(this.rut);
  next();
});

// 🔒 Normaliza también en updates tipo findOneAndUpdate / findByIdAndUpdate
StudentSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update?.rut) update.rut = cleanRut(update.rut);
  if (update?.$set?.rut) update.$set.rut = cleanRut(update.$set.rut);
  next();
});

export const Student = mongoose.model("Student", StudentSchema);
