import Joi from "joi";

// Validación para el campo "nombre"
const nombre = Joi.string()
  .min(3)
  .max(180)
  .required()
  .messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 180 caracteres.",
    "any.required": "El nombre es un campo requerido.",
  });

// Validación para el campo "descripcion"
const descripcion = Joi.string()
  .min(5)
  .max(500)
  .required()
  .messages({
    "string.base": "La descripción debe ser un texto.",
    "string.empty": "La descripción no puede estar vacía.",
    "string.min": "La descripción debe tener al menos 5 caracteres.",
    "string.max": "La descripción no puede exceder los 500 caracteres.",
    "any.required": "La descripción es un campo requerido.",
  });

// Validación para el campo "precio"
const precio = Joi.number()
  .min(0)
  .required()
  .messages({
    "number.base": "El precio debe ser un número.",
    "number.min": "El precio no puede ser negativo.",
    "any.required": "El precio es un campo requerido.",
  });

// Validación para el campo "categoria"
const categoria = Joi.string()
  .required()
  .messages({
    "string.base": "La categoría debe ser un texto.",
    "string.empty": "La categoría no puede estar vacía.",
    "any.required": "La categoría es un campo requerido.",
  });

// Validación para el campo "cantidad_inicial"
const cantidad_inicial = Joi.number()
  .min(0)
  .required()
  .messages({
    "number.base": "La cantidad inicial debe ser un número.",
    "number.min": "La cantidad inicial no puede ser negativa.",
    "any.required": "La cantidad inicial es un campo requerido.",
  });

// Validación para el campo "stock_min"
const stock_min = Joi.number()
  .min(10)
  .required()
  .messages({
    "number.base": "El stock mínimo debe ser un número.",
    "number.min": "El stock mínimo no puede ser menor a 10.",
    "any.required": "El stock mínimo es un campo requerido.",
  });

// Validación para el campo "stock_max"
const stock_max = Joi.number()
  .max(100)
  .required()
  .messages({
    "number.base": "El stock máximo debe ser un número.",
    "number.max": "El stock máximo no puede ser mayor a 100.",
    "any.required": "El stock máximo es un campo requerido.",
  });

  const numero_producto = Joi.number()
  .optional()  // Hacerlo opcional para la creación
  .messages({
    "number.base": "El número de producto debe ser un valor numérico.",
    "any.required": "El número de producto es requerido."
  });

export const createProductoSchema = Joi.object({
  nombre,
  descripcion,
  precio,
  categoria,
  cantidad_inicial,
  stock_min,
  stock_max,
  numero_producto: numero_producto.optional(), // Hacerlo opcional para la creación
});

export const updateProductoSchema = Joi.object({
  nombre,
  descripcion,
  precio,
  categoria,
  cantidad_inicial,
  stock_min,
  stock_max,
  numero_producto: numero_producto.required(), // Requerido solo cuando se actualiza
});


// Esquema de validación para obtener un producto por ID (parámetros)
export const getProductoParamsSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
      "any.required": "El campo ID es requerido.",
    }),
});

// Esquema de validación para borrar un producto (parámetros)
export const deleteProductoSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
      "any.required": "El campo ID es requerido.",
    }),
});
