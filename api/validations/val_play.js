const { date } = require('joi');
const Joi = require('joi');

// Courses
const round_add = Joi.object({
  user_id: Joi.number().integer().required(),
  course_name: Joi.string()
    .pattern(new RegExp(/^[0-9A-Za-z ]{1,100}$/))
    .required(),
  round_date: Joi.string()
    .pattern(new RegExp(/^\d{2}[.\/-]\d{2}[.\/-]\d{4}$/))
    .required(),
});

// Tournaments
const tournament_list = Joi.object({
  view: Joi.string().valid(true).required(),
  user_id: Joi.number().integer().required(),
});
const tournament_sign_up = Joi.object({
  user_id: Joi.number().integer().required(),
  tournament_name: Joi.string()
    .pattern(new RegExp(/^(?=.{8})(.*[^0-9a-zA-Z].*)$/))
    .required(),
  tournament_date: Joi.string()
    .pattern(new RegExp(/^\d{2}[.\/-]\d{2}[.\/-]\d{4}$/))
    // .pattern(new RegExp(/^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})/))
    .required(),
});
const tournament_get_name = Joi.object({
  tournament_name: Joi.string()
    .pattern(new RegExp(/^(?=.{8})(.*[^0-9a-zA-Z].*)$/))
    .required(),
  tournament_date: Joi.string()
    .pattern(new RegExp(/^\d{2}[.\/-]\d{2}[.\/-]\d{4}$/))
    // .pattern(new RegExp(/^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})/))
    .required(),
});

module.exports = {
  round_add,
  tournament_list,
  tournament_sign_up,
  tournament_get_name,
};
