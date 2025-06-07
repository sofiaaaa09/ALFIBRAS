import Joi from "joi";


const idValidacion = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido',
    'string.empty': 'El ID no puede estar vacío'
  });

  const emailValidacion = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.email': 'Debe proporcionar un correo electrónico válido',
    'any.required': 'El correo es un campo requerido'
  });

  const fechaValidacion = Joi.date()
  .messages({
    'date.base': 'La fecha debe ser una fecha válida'
  });

  const estadoValidacion = Joi.string()
  .valid('pendiente', 'completada', 'cancelada')
  .default('pendiente')
  .messages({
    'any.only': 'El estado debe ser: pendiente, completada o cancelada'
  });
  
  const detalleValidacion = Joi.object({
    producto_id: idValidacion.required(),
    producto_nombre: Joi.string().min(3).required(),
    categoria_nombre: Joi.string().min(3).required(),
    cantidad: Joi.number().integer().min(1).required(),
    precio_unitario: Joi.number().min(0).required()
  }).required();

const totalValidacion = Joi.number()
  .precision(2)
  .min(0)
  .required()
  .messages({
    'number.base': 'El total debe ser un número',
    'number.min': 'El total no puede ser negativo',
    'any.required': 'El total es un campo requerido'
  });



export const createOrdenSchema = Joi.object({
  cliente_correo: Joi.string().email().required(),
  estado: Joi.string().valid('pendiente', 'completada', 'cancelada').required(),
  detalles: Joi.array().items(
    Joi.object({
      producto_id: Joi.string().required(),
      producto_nombre: Joi.string().required(),
      categoria_nombre: Joi.string().required(),
      cantidad: Joi.number().min(1).required(),
      precio_unitario: Joi.number().min(0).required()
    }).required()
  ).min(1).required(),
  total: Joi.number().min(0).required(), 
  numero_orden: Joi.string().required(),
  fecha: Joi.date().required()
});

export const updateOrdenSchema = Joi.object({
  cliente_correo: emailValidacion,
  fecha: fechaValidacion,
  estado: estadoValidacion,
  detalles: Joi.array().items(detalleValidacion).min(1),
  total: Joi.number().min(0)
}).options({ abortEarly: false });

export const getOrdenParamsSchema = Joi.object({
  id: idValidacion.required()
});

export const deleteOrdenSchema = Joi.object({
  id: idValidacion.required()
});



export const detalleOrdenSchema = Joi.object({
  numero_producto: Joi.string()
    .pattern(/^[A-Z0-9-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'El número de producto debe contener solo mayúsculas, números y guiones',
      'any.required': 'El número de producto es requerido'
    }),

  cantidad: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'La cantidad debe ser un número',
      'number.integer': 'La cantidad debe ser un entero',
      'number.min': 'La cantidad mínima es 1',
      'any.required': 'La cantidad es requerida'
    }),

  precio_unitario: Joi.number()
    .precision(2)
    .min(0.01)
    .required()
    .messages({
      'number.base': 'El precio debe ser un número',
      'number.min': 'El precio mínimo es 0.01',
      'any.required': 'El precio es requerido'
    }),

  producto_nombre: Joi.string()
    .min(3)
    .required(),

  categoria_nombre: Joi.string()
    .min(3)
    .required(),

  descripcion: Joi.string()
    .allow('')
    .optional()
}).options({ abortEarly: false });