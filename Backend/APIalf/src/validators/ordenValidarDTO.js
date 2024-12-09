import Joi from "joi";

// Validaciones para los campos de la orden
const cliente_correo = Joi.string().email().required().messages({
  "string.base": "El campo cliente_correo debe ser una cadena de texto.",
  "string.email": "El cliente_correo debe ser un correo electrónico válido.",
  "any.required": "El cliente_correo es un campo requerido.",
});

const fecha = Joi.date().required().messages({
  "date.base": "La fecha debe ser una fecha válida.",
  "any.required": "La fecha es un campo requerido.",
});

const estado = Joi.string().valid("pendiente", "procesada", "completada", "enviado").required().messages({
  "string.base": "El estado debe ser un texto.",
  "any.required": "El estado es un campo requerido.",
  "any.only": "El estado debe ser uno de los siguientes: pendiente, enviado, entregado.",
});

const total = Joi.number().min(0).required().messages({
  "number.base": "El total debe ser un número.",
  "number.min": "El total debe ser al menos 0.",
  "any.required": "El total es un campo requerido.",
});

const detalles = Joi.array()
  .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Cada ID en detalles debe ser un ObjectId válido.",
  }))
  .required()
  .messages({
    "array.base": "Los detalles deben ser un arreglo de IDs válidos.",
    "any.required": "Los detalles son un campo requerido.",
  });

// Esquema de validación para la creación de una orden
export const createOrdenSchema = Joi.object({
  cliente_correo,
  fecha,
  estado,
  total,
  detalles, // Detalles es obligatorio
});

// Esquema de validación para actualizar una orden
export const updateOrdenSchema = Joi.object({
  cliente_correo,
  fecha,
  estado,
  total,
  detalles, // Detalles es obligatorio
});

// Esquema de validación para obtener una orden por ID
export const getOrdenParamsSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
      "any.required": "El campo ID es requerido.",
    }),
});

// Esquema de validación para borrar una orden
export const deleteOrdenSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
      "any.required": "El campo ID es requerido.",
    }),
});
