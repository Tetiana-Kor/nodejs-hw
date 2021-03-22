const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaAddContact = Joi.object({
  name: Joi.string().min(2).max(40).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  subscription: Joi.string().optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(2).max(40).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  subscription: Joi.string().optional(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, "")}`,
    });
  }
  next();
};

module.exports.addContact = (req, res, next) => {
  return validate(schemaAddContact, req.body, next);
};

module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
