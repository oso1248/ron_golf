const Joi = require('joi');

// Users
const user_view = Joi.object({
  view: Joi.string().valid(true),
});
const user_add = Joi.object({
  username: Joi.string()
    .pattern(new RegExp(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/))
    .required(),
  name: Joi.string()
    .pattern(new RegExp(/^\b(?!.*?\s{2})[A-Za-z ]{4,50}\b$/))
    .required(),
  email: Joi.string()
    .lowercase()
    .pattern(new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/))
    .required(),
  handicap: Joi.number().integer().min(0).max(100),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/))
    .required(),
  password2: Joi.ref(`password`),
});
const user_get_username = Joi.object({
  username: Joi.string().required(),
});
const user_get_email = Joi.object({
  email: Joi.string().required(),
});
const user_get_name = Joi.object({
  name: Joi.string().required(),
});
const user_update_name = Joi.object({
  name: Joi.string()
    .pattern(new RegExp(/^\b(?!.*?\s{2})[A-Za-z ]{4,50}\b$/))
    .required(),
  email: Joi.string()
    .lowercase()
    .pattern(new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/))
    .required(),
  handicap: Joi.number().integer().min(0).max(100),
});
const user_delete_name = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  user_view,
  user_add,
  user_get_username,
  user_get_email,
  user_get_name,
  user_update_name,
  user_delete_name,
};
