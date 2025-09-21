import { Router } from "express";
import {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  removeStudent,
} from "../controllers/student.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  studentCreateSchema,
  studentUpdateSchema,
} from "../validators/student.schema.js";
import { sanitizeStudentBody } from "../middlewares/sanitize.js";

const router = Router();

router.post(
  "/",
  sanitizeStudentBody,
  validate(studentCreateSchema),
  createStudent
);
router.get("/", listStudents);
router.get("/:id", getStudent);
router.patch(
  "/:id",
  sanitizeStudentBody,
  validate(studentUpdateSchema),
  updateStudent
);
router.delete("/:id", removeStudent);

export default router;
