export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Validación fallida", errors: err.errors });
    }
  };
