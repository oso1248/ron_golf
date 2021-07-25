const Joi = require('joi');

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const register = Joi.object({
  username: Joi.string()
    .pattern(new RegExp(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/))
    .required(),
  email: Joi.string()
    .lowercase()
    .pattern(new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
    .required(),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/))
    .required(),
  password2: Joi.ref(`password`),
});

const username = Joi.object({
  username: Joi.string().required(),
});

const email = Joi.object({
  email: Joi.string().required(),
});

module.exports = {
  login,
  register,
  username,
  email,
};
