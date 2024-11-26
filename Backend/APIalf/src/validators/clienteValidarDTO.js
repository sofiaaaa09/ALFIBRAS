import Joi from 'joi';

// Validaciones comunes para los campos de cliente
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

const edad = Joi.number()
  .integer()
  .min(1)
  .max(120)
  .required()
  .messages({
    "number.base": "La edad debe ser un número.",
    "number.integer": "La edad debe ser un número entero.",
    "number.min": "La edad debe ser al menos 1.",
    "number.max": "La edad no puede exceder 120.",
    "any.required": "La edad es un campo requerido."
  });

const email = Joi.string()
  .email()
  .required()
  .messages({
    "string.email": "El campo debe ser un correo electrónico válido.",
    "any.required": "El email es un campo requerido."
  });

const telefono = Joi.number()
  .required()
  .messages({
    "number.base": "El teléfono debe ser un número.",
    "any.required": "El teléfono es un campo requerido."
  });

const direccion = Joi.string()
  .min(5)
  .max(255) 
  .required()
  .messages({
    "string.base": "La dirección debe ser un texto.",
    "string.empty": "La dirección no puede estar vacía.",
    "string.min": "La dirección debe tener al menos 5 caracteres.",
    "string.max": "La dirección no puede exceder los 255 caracteres.",
    "any.required": "La dirección es un campo requerido."
  });


export const getClienteParamsSchema = Joi.object({
  id: id.required()  
});


export const createClienteSchema = Joi.object({
  nombre: nombre,
  edad: edad,
  email: email,
  telefono: telefono,
  direccion: direccion
});


export const updateClienteSchema = Joi.object({
  nombre: nombre,
  edad: edad,
  email: email,
  telefono: telefono,
  direccion: direccion
});


export const getClienteSchema = Joi.object({
  id: id.required()  
});


export const deleteClienteSchema = Joi.object({
  id: id.required()  
});

