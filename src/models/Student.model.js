import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    rut: { type: String, required: true, unique: true, uppercase: true },
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

export const Student = mongoose.model("Student", StudentSchema);
