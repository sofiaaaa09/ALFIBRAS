import Joi from 'joi';

// Validaciones comunes para los campos del inventario
const producto = Joi.string()
  .min(1)  // El nombre del producto debe tener al menos un carácter
  .required()
  .messages({
    "string.base": "El nombre del producto debe ser un texto.",
    "string.min": "El nombre del producto debe tener al menos un carácter.",
    "any.required": "El nombre del producto es requerido."
  });

const stock = Joi.number()
  .integer()
  .min(0)  // El stock no puede ser negativo
  .required()
  .messages({
    "number.base": "El stock debe ser un número.",
    "number.integer": "El stock debe ser un número entero.",
    "number.min": "El stock no puede ser negativo.",
    "any.required": "El stock es un campo requerido."
  });

const stock_min = Joi.number()
  .integer()
  .min(0)  // El stock mínimo no puede ser negativo
  .required()
  .messages({
    "number.base": "El stock mínimo debe ser un número.",
    "number.integer": "El stock mínimo debe ser un número entero.",
    "number.min": "El stock mínimo no puede ser negativo.",
    "any.required": "El stock mínimo es un campo requerido."
  });

const stock_max = Joi.number()
  .integer()
  .min(0)  // El stock máximo no puede ser negativo
  .required()
  .messages({
    "number.base": "El stock máximo debe ser un número.",
    "number.integer": "El stock máximo debe ser un número entero.",
    "number.min": "El stock máximo no puede ser negativo.",
    "any.required": "El stock máximo es un campo requerido."
  });

// Esquema de validación para los parámetros de la URL (por ejemplo, el id del inventario)
export const getInventarioParamsSchema = Joi.object({
  id: Joi.string().required()  // El nombre del producto es obligatorio
});

// Esquema para crear un inventario
export const createInventarioSchema = Joi.object({
  producto: producto,
  stock: stock,
  stock_min: stock_min,
  stock_max: stock_max,
});

// Esquema para actualizar un inventario
export const updateInventarioSchema = Joi.object({
  producto: producto.optional(),
  stock: stock.optional(),
  stock_min: stock_min.optional(),
  stock_max: stock_max.optional(),
});

// Esquema para obtener un inventario por nombre del producto
export const getInventarioSchema = Joi.object({
  id: Joi.string().required()  // El nombre del producto es obligatorio
});

// Esquema para borrar un inventario
export const deleteInventarioSchema = Joi.object({
  id: Joi.string().required()  // El nombre del producto es obligatorio
});
