import Joi from 'joi';

// Lista de categorías predefinidas
const categoriasDisponibles = ["Puertas", "Techos", "Macetas", "Silleteria", "Cajeros Dom"];

// Validaciones comunes para los campos de producto
const nombre = Joi.string()
  .min(3)
  .max(180)
  .required()
  .messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 180 caracteres.",
    "any.required": "El nombre es un campo requerido."
  });

const descripcion = Joi.string()
  .min(5)
  .max(500)
  .required()
  .messages({
    "string.base": "La descripción debe ser un texto.",
    "string.empty": "La descripción no puede estar vacía.",
    "string.min": "La descripción debe tener al menos 5 caracteres.",
    "string.max": "La descripción no puede exceder los 500 caracteres.",
    "any.required": "La descripción es un campo requerido."
  });

const precio = Joi.number()
  .min(0)
  .required()
  .messages({
    "number.base": "El precio debe ser un número.",
    "number.min": "El precio no puede ser negativo.",
    "any.required": "El precio es un campo requerido."
  });

const categoria = Joi.string()
  .valid(...categoriasDisponibles)
  .required()
  .messages({
    "any.only": `La categoría debe ser una de las siguientes: ${categoriasDisponibles.join(", ")}.`,
    "any.required": "La categoría es un campo requerido."
  });

const cantidad_inicial = Joi.number()
  .min(0)
  .required()
  .messages({
    "number.base": "La cantidad inicial debe ser un número.",
    "number.min": "La cantidad inicial no puede ser negativa.",
    "any.required": "La cantidad inicial es un campo requerido."
  });

const stock_min = Joi.number()
  .min(10)
  .required()
  .messages({
    "number.base": "El stock mínimo debe ser un número.",
    "number.min": "El stock mínimo no puede ser menor a 10.",
    "any.required": "El stock mínimo es un campo requerido."
  });

const stock_max = Joi.number()
  .max(100)
  .required()
  .messages({
    "number.base": "El stock máximo debe ser un número.",
    "number.max": "El stock máximo no puede ser mayor a 100.",
    "any.required": "El stock máximo es un campo requerido."
  });

// Validación personalizada: stock_min <= stock_max
const validarStock = (schema) =>
  schema.custom((value, helpers) => {
    if (value.stock_min > value.stock_max) {
      return helpers.message("El stock mínimo no puede ser mayor que el stock máximo.");
    }
    return value;
  });

// Esquema para crear un producto
export const createProductoSchema = validarStock(
  Joi.object({
    nombre,
    descripcion,
    precio,
    categoria,
    cantidad_inicial,
    stock_min,
    stock_max,
  })
);

// Esquema para obtener un producto por ID
export const getProductoParamsSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
      "any.required": "El campo ID es requerido."
    })
});

// Esquema para actualizar un producto
export const updateProductoSchema = validarStock(
  Joi.object({
    nombre,
    descripcion,
    precio,
    categoria,
    cantidad_inicial,
    stock_min,
    stock_max,
  })
);

// Esquema para borrar un producto
export const deleteProductoSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
      "any.required": "El campo ID es requerido."
    })
});
