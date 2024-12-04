import Joi from "joi";

const id = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "El campo ID debe ser un ObjectId válido.",
    "any.required": "El campo ID es requerido.",
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
    "any.required": "El nombre es requerido.",
  });

const email = Joi.string()
  .email()
  .required()
  .messages({
    "string.email": "El campo debe ser un correo válido.",
    "any.required": "El email es requerido.",
  });

const telefono = Joi.number()
  .required()
  .messages({
    "number.base": "El teléfono debe ser un número.",
    "any.required": "El teléfono es requerido.",
  });

const direccion = Joi.string()
  .min(5)
  .max(255)
  .required()
  .messages({
    "string.base": "La dirección debe ser texto.",
    "string.empty": "La dirección no puede estar vacía.",
    "string.min": "La dirección debe tener al menos 5 caracteres.",
    "string.max": "La dirección no puede exceder 255 caracteres.",
    "any.required": "La dirección es requerida.",
  });

const rol = Joi.string()
  .valid("Usuario")
  .default("Usuario");

const password = Joi.string()
  .min(6)
  .required()
  .messages({
    "string.base": "La contraseña debe ser un texto.",
    "string.empty": "La contraseña no puede estar vacía.",
    "string.min": "La contraseña debe tener al menos 6 caracteres.",
    "any.required": "La contraseña es requerida.",
  });

export const getClienteParamsSchema = Joi.object({ id });

export const createClienteSchema = Joi.object({
  nombre,
  email,
  telefono,
  direccion,
  rol,
  password, // Agregado el campo password
});

export const updateClienteSchema = Joi.object({
  nombre,
  email,
  telefono,
  direccion,
  rol,
  password, // Agregado el campo password en la actualización
});

export const deleteClienteSchema = Joi.object({ id });
