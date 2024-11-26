import Joi from 'joi';

// Validaciones comunes para los campos de envío
const id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "any.required": "El campo ID es requerido."
  });

const orden_id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "El campo orden_id debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "any.required": "El campo orden_id es requerido."
  });

const direccion_envio = Joi.string()
  .min(5)
  .max(255)
  .required()
  .messages({
    "string.base": "La dirección de envío debe ser un texto.",
    "string.empty": "La dirección de envío no puede estar vacía.",
    "string.min": "La dirección de envío debe tener al menos 5 caracteres.",
    "string.max": "La dirección de envío no puede exceder los 255 caracteres.",
    "any.required": "La dirección de envío es un campo requerido."
  });

const fecha_envio = Joi.date()
  .required()
  .messages({
    "date.base": "La fecha de envío debe ser una fecha válida.",
    "any.required": "La fecha de envío es un campo requerido."
  });

const estado = Joi.string()
  .valid("pendiente", "enviado", "entregado", "fallido")
  .required()
  .messages({
    "string.base": "El estado debe ser un texto.",
    "any.only": "El estado debe ser uno de los siguientes: pendiente, enviado, entregado, fallido.",
    "any.required": "El estado es un campo requerido."
  });


export const getEnvioParamsSchema = Joi.object({
  id: id.required() 
});


export const createEnvioSchema = Joi.object({
  orden_id: orden_id,
  direccion_envio: direccion_envio,
  fecha_envio: fecha_envio,
  estado: estado
});


export const updateEnvioSchema = Joi.object({
  orden_id: orden_id,
  direccion_envio: direccion_envio,
  fecha_envio: fecha_envio,
  estado: estado
});


export const getEnvioSchema = Joi.object({
  id: id.required()  
});


export const deleteEnvioSchema = Joi.object({
  id: id.required() 
});
