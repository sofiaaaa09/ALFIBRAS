import Joi from 'joi';


const producto = Joi.string()
  .min(1)  
  .required()
  .messages({
    "string.base": "El nombre del producto debe ser un texto.",
    "string.min": "El nombre del producto debe tener al menos un carácter.",
    "any.required": "El nombre del producto es requerido."
  });

const stock = Joi.number()
  .integer()
  .min(0)  
  .required()
  .messages({
    "number.base": "El stock debe ser un número.",
    "number.integer": "El stock debe ser un número entero.",
    "number.min": "El stock no puede ser negativo.",
    "any.required": "El stock es un campo requerido."
  });

const stock_min = Joi.number()
  .integer()
  .min(0)  
  .required()
  .messages({
    "number.base": "El stock mínimo debe ser un número.",
    "number.integer": "El stock mínimo debe ser un número entero.",
    "number.min": "El stock mínimo no puede ser negativo.",
    "any.required": "El stock mínimo es un campo requerido."
  });

const stock_max = Joi.number()
  .integer()
  .min(0)  
  .required()
  .messages({
    "number.base": "El stock máximo debe ser un número.",
    "number.integer": "El stock máximo debe ser un número entero.",
    "number.min": "El stock máximo no puede ser negativo.",
    "any.required": "El stock máximo es un campo requerido."
  });


export const getInventarioParamsSchema = Joi.object({
  id: Joi.string().required()  
});


export const createInventarioSchema = Joi.object({
  producto: producto,
  stock: stock,
  stock_min: stock_min,
  stock_max: stock_max,
});


export const updateInventarioSchema = Joi.object({
  producto: producto.optional(),
  stock: stock.optional(),
  stock_min: stock_min.optional(),
  stock_max: stock_max.optional(),
});


export const getInventarioSchema = Joi.object({
  id: Joi.string().required()  
});

// Esquema para borrar un inventario
export const deleteInventarioSchema = Joi.object({
  id: Joi.string().required()  
});
