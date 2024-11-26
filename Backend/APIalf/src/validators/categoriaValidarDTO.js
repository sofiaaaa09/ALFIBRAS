import Joi from 'joi';


const id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)  
  .required()
  .messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "any.required": "El campo ID es requerido."
  });


  const nombre_categoria = Joi.string()
  .min(3)
  .max(180)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s-]+$/)  // Permitir letras, espacios y guiones
  .messages({
    "string.base": "El nombre de la categoría debe ser un texto.",
    "string.empty": "El nombre de la categoría no puede estar vacío.",
    "string.min": "El nombre de la categoría debe tener al menos 3 caracteres.",
    "string.max": "El nombre de la categoría no puede exceder los 180 caracteres.",
    "string.pattern.base": "El nombre de la categoría solo puede contener letras, espacios y guiones.",
    "any.required": "El nombre de la categoría es un campo requerido."
  });

const descripcion = Joi.string()
  .min(5)
  .max(255)
  .required()
  .messages({
    "string.base": "La descripción debe ser un texto.",
    "string.empty": "La descripción no puede estar vacía.",
    "string.min": "La descripción debe tener al menos 5 caracteres.",
    "string.max": "La descripción no puede exceder los 255 caracteres.",
    "any.required": "La descripción es un campo requerido."
  });

const estado = Joi.string()
  .valid('activo', 'inactivo')  
  .required()
  .messages({
    "string.base": "El estado debe ser un texto.",
    "any.only": "El estado debe ser 'activo' o 'inactivo'.",
    "any.required": "El estado es un campo requerido."
  });


export const getCategoriaParamsSchema = Joi.object({
  id: id.required() 
});


export const createCategoriaSchema = Joi.object({
  nombre_categoria: nombre_categoria,
  descripcion: descripcion,
  estado: estado
});


export const updateCategoriaSchema = Joi.object({
  nombre_categoria: nombre_categoria,
  descripcion: descripcion,
  estado: estado
});


export const getCategoriaSchema = Joi.object({
  id: id.required()  
});


export const deleteCategoriaSchema = Joi.object({
  id: id.required()  
});
 
