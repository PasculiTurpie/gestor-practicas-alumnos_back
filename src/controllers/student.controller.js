import { Student } from "../models/Student.model.js";
import { AppError } from "../utils/errors.js";

export const createStudent = async (req, res) => {
  try {
    const exists = await Student.findOne({
      $or: [{ rut: req.body.rut }, { nrcCode: req.body.nrcCode }],
    });
    if (exists) throw new AppError("El RUT o NRC ya existen", 409);
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};

export const listStudents = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = q ? { $text: { $search: q } } : {};
    const [items, total] = await Promise.all([
      Student.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Student.countDocuments(filter),
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

export const getStudent = async (req, res) => {
  try {
    const item = await Student.findById(req.params.id);
    if (!item) throw new AppError("Alumno no encontrado", 404);
    res.json(item);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const item = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) throw new AppError("Alumno no encontrado", 404);
    res.json(item);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};

export const removeStudent = async (req, res) => {
  try {
    const item = await Student.findByIdAndDelete(req.params.id);
    if (!item) throw new AppError("Alumno no encontrado", 404);
    res.json({ message: "Alumno eliminado" });
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};
