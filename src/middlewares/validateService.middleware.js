import { REQUIRED_FIELDS } from "../config/service.config.js";

const FIELD_TYPES = {
  name: "string",
  description: "string",
  duration: "number",
  price: "number",
  category: "string",
  available: "boolean",
};

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

export function validateServiceTypes(req, res, next) {
  const body = req.body ?? {};

  const invalidFields = Object.keys(FIELD_TYPES).filter(
    (field) =>
      body[field] !== undefined && typeof body[field] !== FIELD_TYPES[field],
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Hay campos con un tipo de dato inválido",
      invalidFields,
    });
  }

  next();
}