import Joi from "joi";

// Validaciones para los campos de la orden
const cliente_id = Joi.string().required().messages({
  "string.base": "El campo cliente_id debe ser una cadena de texto.",
  "any.required": "El cliente_id es un campo requerido.",
});

const fecha = Joi.date().required().messages({
  "date.base": "La fecha debe ser una fecha válida.",
  "any.required": "La fecha es un campo requerido.",
});

const estado = Joi.string().valid("pendiente", "enviado", "entregado").required().messages({
  "string.base": "El estado debe ser un texto.",
  "any.required": "El estado es un campo requerido.",
  "any.only": "El estado debe ser uno de los siguientes: pendiente, enviado, entregado.",
});

const total = Joi.number().min(0).required().messages({
  "number.base": "El total debe ser un número.",
  "number.min": "El total debe ser al menos 0.",
  "any.required": "El total es un campo requerido.",
});

// Esquemas de validación para las rutas
export const createOrdenSchema = Joi.object({
  cliente_id,
  fecha,
  estado,
  total,
});

export const getOrdenParamsSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "El campo ID debe ser una cadena de texto.",
    "any.required": "El ID es un campo requerido.",
  }),
});

export const updateOrdenSchema = Joi.object({
  cliente_id,
  fecha,
  estado,
  total,
});

export const deleteOrdenSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "El campo ID debe ser una cadena de texto.",
    "any.required": "El ID es un campo requerido.",
  }),
});
