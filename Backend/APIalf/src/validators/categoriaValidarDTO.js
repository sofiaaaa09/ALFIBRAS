import Joi from 'joi';

// Validación para nombre_categoria
const nombre_categoria = Joi.string()
  .min(3)
  .max(180)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El nombre de la categoría debe ser un texto.",
    "string.empty": "El nombre de la categoría no puede estar vacío.",
    "string.min": "El nombre de la categoría debe tener al menos 3 caracteres.",
    "string.max": "El nombre de la categoría no puede exceder los 180 caracteres.",
    "string.pattern.base": "El nombre de la categoría solo puede contener letras y espacios.",
    "any.required": "El nombre de la categoría es un campo requerido."
  });

// Validación para descripción
const descripcion = Joi.string()
  .min(10)
  .max(500)
  .required()
  .messages({
    "string.base": "La descripción debe ser un texto.",
    "string.empty": "La descripción no puede estar vacía.",
    "string.min": "La descripción debe tener al menos 10 caracteres.",
    "string.max": "La descripción no puede exceder los 500 caracteres.",
    "any.required": "La descripción es un campo requerido."
  });

// Validación para estado
const estado = Joi.string()
  .valid("activo", "inactivo")
  .required()
  .messages({
    "string.base": "El estado debe ser un texto.",
    "any.only": "El estado solo puede ser 'activo' o 'inactivo'.",
    "any.required": "El estado es un campo requerido."
  });

// Esquema para crear una categoría
export const createCategoriaSchema = Joi.object({
  nombre_categoria,
  descripcion,
  estado
});

// Esquema para actualizar una categoría
export const updateCategoriaSchema = Joi.object({
  nombre_categoria: nombre_categoria.optional(),
  descripcion: descripcion.optional(),
  estado: estado.optional()
});

// Esquema para obtener o eliminar una categoría por ID
const id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "any.required": "El campo ID es requerido."
  });

export const getCategoriaParamsSchema = Joi.object({
  id
});

export const deleteCategoriaSchema = Joi.object({
  id
});
