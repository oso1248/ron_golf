const db = require('../queries/qry_tournaments');
const validate = require('../validations/val_tournaments');
const ApiError = require('../error/ApiError');

// Tournaments
exports.tournament_list = async function (req, res, next) {
  validate.tournament_list
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_list())
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.tournament_get_id = async function (req, res, next) {
  validate.tournament_get_id
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_get_id(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.tournament_played_get_id = async function (req, res, next) {
  validate.tournament_played_get_id
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_played_get_id(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.tournament_details_get_id = async function (req, res, next) {
  validate.tournament_details_get_id
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_details_get_id(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
