import "dotenv/config";
import { connectDB } from "../src/config/db.js";
import { Student } from "../src/models/Student.model.js";
import { cleanRut } from "../src/utils/rut.js";

await connectDB(process.env.MONGODB_URI);

const students = await Student.find({}, { _id: 1, rut: 1 });
let updates = 0;
for (const s of students) {
  const cleaned = cleanRut(s.rut);
  if (cleaned !== s.rut) {
    try {
      await Student.updateOne({ _id: s._id }, { rut: cleaned });
      updates++;
    } catch (err) {
      console.error(
        `Conflicto normalizando RUT ${s.rut} -> ${cleaned} (id ${s._id})`,
        err.message
      );
    }
  }
}
console.log(`✔ Normalización completa. Registros actualizados: ${updates}`);
process.exit(0);
