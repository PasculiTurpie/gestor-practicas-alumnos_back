import { Practice } from "../models/Practice.model.js";
import { Student } from "../models/Student.model.js";
import { AppError } from "../utils/errors.js";

export const createPractice = async (req, res) => {
  try {
    const student = await Student.findById(req.body.studentId);
    if (!student) throw new AppError("Alumno no existe", 404);

    const exists = await Practice.findOne({ studentId: student._id });
    if (exists)
      throw new AppError("Ya existe una práctica para este alumno", 409);

    const practice = await Practice.create({
      studentId: student._id,
      currentStage: req.body.currentStage || "RECOPILACION_Y_CARPETA",
      stageHistory: [
        {
          stage: "RECOPILACION_Y_CARPETA",
          status: "done",
          notes: "Inicio automático",
        },
      ],
    });
    res.status(201).json(practice);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};

export const listPractices = async (req, res) => {
  try {
    const { stage, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = stage ? { currentStage: stage } : {};
    const [items, total] = await Promise.all([
      Practice.find(filter)
        .populate("studentId")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Practice.countDocuments(filter),
    ]);
    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const advanceStage = async (req, res) => {
  try {
    const item = await Practice.findById(req.params.id);
    if (!item) throw new AppError("Práctica no encontrada", 404);

    const { nextStage, notes } = req.body;
    item.stageHistory.push({ stage: nextStage, status: "done", notes });
    item.currentStage = nextStage;
    if (nextStage === "NOTA_FINAL_CIERRE") item.closedAt = new Date();

    await item.save();
    res.json(item);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};

export const updateFinalGrade = async (req, res) => {
  try {
    const item = await Practice.findById(req.params.id);
    if (!item) throw new AppError("Práctica no encontrada", 404);
    const { finalGrade } = req.body;
    item.finalGrade = finalGrade;
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};

export const getPracticeByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) throw new AppError("Alumno no existe", 404);

    const practice = await Practice.findOne({ studentId }).populate(
      "studentId"
    );
    if (!practice)
      return res
        .status(404)
        .json({ message: "Práctica no encontrada para este alumno" });

    res.json(practice);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};