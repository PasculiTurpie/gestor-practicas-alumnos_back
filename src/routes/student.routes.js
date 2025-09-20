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

const router = Router();

router.post("/", validate(studentCreateSchema), createStudent);
router.get("/", listStudents);
router.get("/:id", getStudent);
router.patch("/:id", validate(studentUpdateSchema), updateStudent);
router.delete("/:id", removeStudent);

export default router;
