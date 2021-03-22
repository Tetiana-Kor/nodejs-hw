const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaAddUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(2).max(20).required(),
  subscription: Joi.string().optional(),
});

const schemaUpdateSub = Joi.object({
  subscription: Joi.string().required(),
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

module.exports.addUser = (req, res, next) => {
  return validate(schemaAddUser, req.body, next);
};

module.exports.updateSub = (req, res, next) => {
  return validate(schemaUpdateSub, req.body, next);
};

module.exports.validateUploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Avatar is not found",
    });
  }
  next();
};
