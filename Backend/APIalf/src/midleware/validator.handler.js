import boom from "@hapi/boom";

export const validatorHandler = (schema, property) => {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      console.log("🧩 Error de validación Joi:");
      console.log(error.details.map((err) => err.message));
      return next(boom.badRequest(error)); // ⬅️ Aquí añadimos el return
    }

    next();
  };
};
