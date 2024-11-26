import Joi from "joi";

// Validaciones para los campos del detalle de la orden
const orden_id = Joi.string().required().messages({
  "string.base": "El campo orden_id debe ser una cadena de texto.",
  "any.required": "El orden_id es un campo requerido.",
});

const producto_id = Joi.string().required().messages({
  "string.base": "El campo producto_id debe ser una cadena de texto.",
  "any.required": "El producto_id es un campo requerido.",
});

const categoria_id = Joi.string().required().messages({
  "string.base": "El campo categoria_id debe ser una cadena de texto.",
  "any.required": "El categoria_id es un campo requerido.",
});

const cantidad = Joi.number().min(1).required().messages({
  "number.base": "La cantidad debe ser un número.",
  "number.min": "La cantidad debe ser al menos 1.",
  "any.required": "La cantidad es un campo requerido.",
});

const precio_unitario = Joi.number().min(0).required().messages({
  "number.base": "El precio unitario debe ser un número.",
  "number.min": "El precio unitario debe ser al menos 0.",
  "any.required": "El precio unitario es un campo requerido.",
});

const personalizacion = Joi.string().allow("").messages({
  "string.base": "El campo personalizacion debe ser una cadena de texto.",
});

// Esquemas de validación para las rutas
export const createDetalleOrdenSchema = Joi.object({
  orden_id,
  producto_id,
  categoria_id,
  cantidad,
  precio_unitario,
  personalizacion,
});

export const getDetalleOrdenParamsSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "El campo ID debe ser una cadena de texto.",
    "any.required": "El ID es un campo requerido.",
  }),
});

export const updateDetalleOrdenSchema = Joi.object({
  orden_id,
  producto_id,
  categoria_id,
  cantidad,
  precio_unitario,
  personalizacion,
});

export const deleteDetalleOrdenSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "El campo ID debe ser una cadena de texto.",
    "any.required": "El ID es un campo requerido.",
  }),
});
