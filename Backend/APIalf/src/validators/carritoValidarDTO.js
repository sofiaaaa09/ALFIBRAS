import Joi from 'joi';

const id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "any.required": "El campo ID es requerido."
  });

const cliente_id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "El campo cliente_id debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "any.required": "El campo cliente_id es requerido."
  });

const estado = Joi.string()
  .valid("pendiente", "procesando", "finalizado", "cancelado")
  .required()
  .messages({
    "any.only": "El estado debe ser uno de los siguientes valores: pendiente, procesando, finalizado, cancelado.",
    "any.required": "El campo estado es requerido."
  });


export const getCarritoParamsSchema = Joi.object({
  id: id.required()  
});

export const createCarritoSchema = Joi.object({
  cliente_id: cliente_id,
  estado: estado
});


export const updateCarritoSchema = Joi.object({
  cliente_id: cliente_id,
  estado: estado
});


export const deleteCarritoSchema = Joi.object({
  id: id.required()  
});
