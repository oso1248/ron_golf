const { date } = require('joi');
const Joi = require('joi');

// Tournaments
const tournament_list = Joi.object({
  view: Joi.string().valid(true).required(),
});
const tournament_get_id = Joi.object({
  tournament_id: Joi.number().integer().required(),
});
const tournament_played_get_id = Joi.object({
  tournament_id: Joi.number().integer().required(),
});
const tournament_details_get_id = Joi.object({
  tournament_id: Joi.number().integer().required(),
});

module.exports = {
  // Tournament
  tournament_list,
  tournament_get_id,
  tournament_played_get_id,
  tournament_details_get_id,
};
