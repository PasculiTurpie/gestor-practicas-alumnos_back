import { Router } from "express";
import {
  createPractice,
  listPractices,
  advanceStage,
  updateFinalGrade,
  getPracticeByStudent,
  getPracticeStats,
  getPracticeStatsCsv, // ⬅️ nuevo
} from "../controllers/practice.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  practiceCreateSchema,
  practiceAdvanceSchema,
} from "../validators/practice.schema.js";

const router = Router();

router.post("/", validate(practiceCreateSchema), createPractice);
router.get("/", listPractices);
router.get("/by-student/:studentId", getPracticeByStudent);
router.get("/stats", getPracticeStats);
router.get("/stats/export", getPracticeStatsCsv); 
router.patch("/:id/advance", validate(practiceAdvanceSchema), advanceStage);
router.patch("/:id/grade", updateFinalGrade);

export default router;
