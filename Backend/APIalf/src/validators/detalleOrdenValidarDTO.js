import Joi from "joi";

// Validación para el campo "numero_producto" (debe ser un número)
const numero_producto = Joi.number().required().messages({
  "number.base": "El campo numero_producto debe ser un número.",
  "any.required": "El numero_producto es un campo requerido.",
});

// Validación para el campo "cantidad" (debe ser un número mayor que 0)
const cantidad = Joi.number().min(1).required().messages({
  "number.base": "La cantidad debe ser un número.",
  "number.min": "La cantidad debe ser al menos 1.",
  "any.required": "La cantidad es un campo requerido.",
});

// Validación para el campo "precio_unitario" (debe ser un número mayor o igual que 0)
const precio_unitario = Joi.number().min(0).required().messages({
  "number.base": "El precio_unitario debe ser un número.",
  "number.min": "El precio_unitario no puede ser menor a 0.",
  "any.required": "El precio_unitario es un campo requerido.",
});

// Validación para el campo "personalizacion" (puede ser un string vacío o con texto)
const personalizacion = Joi.string().allow("").messages({
  "string.base": "El campo personalizacion debe ser una cadena de texto.",
});

// Validación para el campo "archivo" (puede ser una cadena vacía o un string con la ruta del archivo)
const archivo = Joi.string().allow(null, "").messages({
  "string.base": "El campo archivo debe ser una cadena de texto válida o nulo.",
});

// **Esquemas de validación**

export const createDetalleOrdenSchema = Joi.object({
  numero_producto,
  cantidad,
  precio_unitario,
  personalizacion,
  archivo,
});

export const getDetalleOrdenParamsSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
    "any.required": "El campo ID es requerido.",
  }),
  numero_orden: Joi.string().optional().messages({
    "string.base": "El campo numero_orden debe ser una cadena de texto.",
  }),
});

export const updateDetalleOrdenSchema = Joi.object({
  numero_producto,
  cantidad,
  precio_unitario,
  personalizacion,
  archivo,
});

export const deleteDetalleOrdenSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
    "any.required": "El campo ID es requerido.",
  }),
});
