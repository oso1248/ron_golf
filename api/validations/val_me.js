const { date } = require('joi');
const Joi = require('joi');

// Playing
const playing_list = Joi.object({
  user_id: Joi.number().integer().required(),
});

// Played
const played_list = Joi.object({
  user_id: Joi.number().integer().required(),
});

// Details
const details_round_list = Joi.object({
  user_id: Joi.number().integer().required(),
});
const details_round_id = Joi.object({
  user_id: Joi.number().integer().required(),
  round_id: Joi.number().integer().required(),
});
const details_tournament_id = Joi.object({
  user_id: Joi.number().integer().required(),
  tournament_id: Joi.number().integer().required(),
});

module.exports = {
  // Playing
  playing_list,
  //Played
  played_list,
  // Details
  details_round_list,
  details_round_id,
  details_tournament_id,
};
