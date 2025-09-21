import { Practice } from "../models/Practice.model.js";
import { Student } from "../models/Student.model.js";
import { AppError } from "../utils/errors.js";
import { toCsv } from "../utils/csv.js";

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

export const getPracticeStats = async (req, res) => {
  try {
    // Filtros opcionales: ?from=2025-01-01&to=2025-12-31
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.updatedAt = {};
      if (from) match.updatedAt.$gte = new Date(from);
      if (to) match.updatedAt.$lte = new Date(to);
    }

    const pipeline = [
      { $match: match },
      {
        $facet: {
          byStage: [
            { $group: { _id: "$currentStage", count: { $sum: 1 } } },
            { $project: { _id: 0, stage: "$_id", count: 1 } },
            { $sort: { stage: 1 } },
          ],
          totals: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                open: {
                  $sum: {
                    $cond: [
                      { $ne: ["$currentStage", "NOTA_FINAL_CIERRE"] },
                      1,
                      0,
                    ],
                  },
                },
                closed: {
                  $sum: {
                    $cond: [
                      { $eq: ["$currentStage", "NOTA_FINAL_CIERRE"] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            { $project: { _id: 0, total: 1, open: 1, closed: 1 } },
          ],
          byCenterTop5: [
            { $group: { _id: "$studentId", p: { $first: "$$ROOT" } } }, // evitar duplicar por alumno si hubiera varias
            {
              $lookup: {
                from: "students",
                localField: "p.studentId",
                foreignField: "_id",
                as: "student",
              },
            },
            { $unwind: "$student" },
            { $group: { _id: "$student.practiceCenter", count: { $sum: 1 } } },
            { $project: { _id: 0, center: "$_id", count: 1 } },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ];

    const [result] = await Practice.aggregate(pipeline);
    const totals = result?.totals?.[0] || { total: 0, open: 0, closed: 0 };

    res.json({
      totals,
      byStage: result?.byStage || [],
      byCenterTop5: result?.byCenterTop5 || [],
      range: { from: from || null, to: to || null },
    });
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
};

export const getPracticeStatsCsv = async (req, res) => {
  try {
    const { from, to, dataset = "byStage" } = req.query;

    const match = {};
    if (from || to) {
      match.updatedAt = {};
      if (from) match.updatedAt.$gte = new Date(from);
      if (to) match.updatedAt.$lte = new Date(to);
    }

    const pipeline = [
      { $match: match },
      {
        $facet: {
          byStage: [
            { $group: { _id: "$currentStage", count: { $sum: 1 } } },
            { $project: { _id: 0, stage: "$_id", count: 1 } },
            { $sort: { stage: 1 } },
          ],
          totals: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                open: {
                  $sum: {
                    $cond: [
                      { $ne: ["$currentStage", "NOTA_FINAL_CIERRE"] },
                      1,
                      0,
                    ],
                  },
                },
                closed: {
                  $sum: {
                    $cond: [
                      { $eq: ["$currentStage", "NOTA_FINAL_CIERRE"] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            { $project: { _id: 0, total: 1, open: 1, closed: 1 } },
          ],
          byCenterTop5: [
            { $group: { _id: "$studentId", p: { $first: "$$ROOT" } } },
            {
              $lookup: {
                from: "students",
                localField: "p.studentId",
                foreignField: "_id",
                as: "student",
              },
            },
            { $unwind: "$student" },
            { $group: { _id: "$student.practiceCenter", count: { $sum: 1 } } },
            { $project: { _id: 0, center: "$_id", count: 1 } },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ];

    const [agg] = await Practice.aggregate(pipeline);
    const totals = agg?.totals?.[0] || { total: 0, open: 0, closed: 0 };

    let rows = [];
    if (dataset === "totals") {
      rows = [
        { metric: "total", value: totals.total },
        { metric: "open", value: totals.open },
        { metric: "closed", value: totals.closed },
      ];
    } else if (dataset === "byCenterTop5") {
      rows = (agg?.byCenterTop5 || []).map((r) => ({
        center: r.center || "N/A",
        count: r.count,
      }));
    } else {
      // byStage (default)
      rows = (agg?.byStage || []).map((r) => ({
        stage: r.stage,
        count: r.count,
      }));
    }

    const csv = toCsv(rows);
    const suffix =
      [dataset, from ? `from-${from}` : null, to ? `to-${to}` : null]
        .filter(Boolean)
        .join("_") || dataset;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="practices_${suffix}.csv"`
    );
    res.status(200).send(csv);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};