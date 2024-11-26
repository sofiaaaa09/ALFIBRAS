import Joi from 'joi';


const id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido de 24 caracteres hexadecimales.",
    "any.required": "El campo ID es requerido."
  });

const nombre = Joi.string()
  .min(3)
  .max(180)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 180 caracteres.",
    "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    "any.required": "El nombre es un campo requerido."
  });

const email = Joi.string()
  .email()
  .required()
  .messages({
    "string.email": "El campo debe ser un correo electrónico válido.",
    "any.required": "El email es un campo requerido."
  });

const telefono = Joi.string()  
  .min(10)
  .max(15)
  .required()
  .pattern(/^[0-9]+$/)
  .messages({
    "string.base": "El teléfono debe ser un número.",
    "string.empty": "El teléfono no puede estar vacío.",
    "string.min": "El teléfono debe tener al menos 10 caracteres.",
    "string.max": "El teléfono no puede exceder los 15 caracteres.",
    "string.pattern.base": "El teléfono solo puede contener números.",
    "any.required": "El teléfono es un campo requerido."
  });


export const getAdminParamsSchema = Joi.object({
  id: id.required()  
});


export const createAdminSchema = Joi.object({
  nombre: nombre,
  email: email,
  telefono: telefono
});

export const updateAdminSchema = Joi.object({
  nombre: nombre,
  email: email,
  telefono: telefono
});

export const deleteAdminSchema = Joi.object({
  id: id.required()  
});