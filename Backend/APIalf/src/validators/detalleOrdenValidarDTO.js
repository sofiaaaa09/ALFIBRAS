import Joi from "joi";

// Validaciones existentes
const numero_producto = Joi.number().required().messages({
  "number.base": "El campo numero_producto debe ser un número.",
  "any.required": "El numero_producto es un campo requerido.",
});

const cantidad = Joi.number().min(1).required().messages({
  "number.base": "La cantidad debe ser un número.",
  "number.min": "La cantidad debe ser al menos 1.",
  "any.required": "La cantidad es un campo requerido.",
});

const precio_unitario = Joi.number().min(0).required().messages({
  "number.base": "El precio_unitario debe ser un número.",
  "number.min": "El precio_unitario no puede ser menor a 0.",
  "any.required": "El precio_unitario es un campo requerido.",
});

const personalizacion = Joi.string().allow("").messages({
  "string.base": "El campo personalizacion debe ser una cadena de texto.",
});

const archivo = Joi.string().allow(null, "").messages({
  "string.base": "El campo archivo debe ser una cadena de texto válida o nulo.",
});

// Nuevas validaciones para los campos adicionales
const producto_nombre = Joi.string().optional().messages({
  "string.base": "El campo producto_nombre debe ser una cadena de texto.",
});

const categoria_nombre = Joi.string().optional().messages({
  "string.base": "El campo categoria_nombre debe ser una cadena de texto.",
});

// Esquemas de validación

export const createDetalleOrdenSchema = Joi.object({
  numero_producto: Joi.string().required(),
  cantidad: Joi.number().min(1).required(),
  precio_unitario: Joi.number().min(0).required(),
  personalizacion: Joi.string().optional(),
  archivo: Joi.string().allow(null).optional(),
});

// Para consultar o buscar por parámetros
export const getDetalleOrdenParamsSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
    "any.required": "El campo ID es requerido.",
  }),
  numero_orden: Joi.string().optional().messages({
    "string.base": "El campo numero_orden debe ser una cadena de texto.",
  }),
});

// Para actualizar un detalle de orden
export const updateDetalleOrdenSchema = Joi.object({
  numero_producto,
  producto_nombre, // Incluido como opcional
  categoria_nombre, // Incluido como opcional
  cantidad,
  precio_unitario,
  personalizacion,
  archivo,
});

// Para borrar un detalle de orden
export const deleteDetalleOrdenSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
    "any.required": "El campo ID es requerido.",
  }),
});
