import Joi from "joi";

// Validaciones para Factura
const orden_id = Joi.string().required().messages({
  "string.base": "El campo orden_id debe ser una cadena de texto.",
  "any.required": "El orden_id es un campo requerido.",
});

const fecha = Joi.date().required().messages({
  "date.base": "La fecha debe ser una fecha válida.",
  "any.required": "La fecha es un campo requerido.",
});

const total = Joi.number().min(0).required().messages({
  "number.base": "El total debe ser un número.",
  "number.min": "El total debe ser al menos 0.",
  "any.required": "El total es un campo requerido.",
});

// Exportar esquemas
export const createFacturaSchema = Joi.object({
  orden_id,
  fecha,
  total,
});

export const getFacturaParamsSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "El campo ID debe ser una cadena de texto.",
    "any.required": "El ID es un campo requerido.",
  }),
});

export const updateFacturaSchema = Joi.object({
  orden_id,
  fecha,
  total,
});

export const deleteFacturaSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "El campo ID debe ser una cadena de texto.",
    "any.required": "El ID es un campo requerido.",
  }),
});
