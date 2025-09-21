// backend/src/middlewares/sanitize.js
import { cleanRut } from "../utils/rut.js";

export const sanitizeStudentBody = (req, _res, next) => {
  if (req.body?.rut) {
    req.body.rut = cleanRut(req.body.rut);
  }
  next();
};
