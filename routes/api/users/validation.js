const Joi = require("joi");

const schemaAddUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  subscription: Joi.string().required(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: 400,
      message: `Field: ${message.replace(/"/g, "")}`,
    });
  }
  next();
};

module.exports.addUser = (req, res, next) => {
  return validate(schemaAddUser, req.body, next);
};
