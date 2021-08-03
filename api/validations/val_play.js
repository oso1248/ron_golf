const { date } = require('joi');
const Joi = require('joi');

// Rounds
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

// Score
const round_list = Joi.object({
  user_id: Joi.number().integer().required(),
});
const round_get_id = Joi.object({
  user_id: Joi.number().integer().required(),
  round_id: Joi.number().integer().required(),
});
const tournament_get_id = Joi.object({
  user_id: Joi.number().integer().required(),
  tournament_id: Joi.number().integer().required(),
});
const score_upload = Joi.object({
  values: Joi.string().required(),
});

module.exports = {
  // Round
  round_add,
  // Tournament
  tournament_list,
  tournament_sign_up,
  tournament_get_name,
  // Score
  round_list,
  round_get_id,
  tournament_get_id,
  score_upload,
};
