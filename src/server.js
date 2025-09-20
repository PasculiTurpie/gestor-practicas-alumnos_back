import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/student.routes.js";
import practiceRoutes from "./routes/practice.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);

app.get("/", (_req, res) => res.json({ ok: true, name: "Practicas API" }));
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/practices", practiceRoutes);

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 API escuchando en http://localhost:${PORT}`)
  );
});
