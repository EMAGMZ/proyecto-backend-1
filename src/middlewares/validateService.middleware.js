const REQUIRED_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

export function validateService(req, res, next) {
  const body = req.body ?? {};

  const missingFields = REQUIRED_FIELDS.filter(
    (field) => body[field] === undefined || body[field] === null,
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Faltan campos obligatorios",
      missingFields,
    });
  }

  next();
}