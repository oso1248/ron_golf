const db = require('../queries/qry_me');
const validate = require('../validations/val_me');
const ApiError = require('../error/ApiError');

// Playing
exports.playing_list = async function (req, res, next) {
  let data = { user_id: `${req.session.user.user_id}` };
  validate.playing_list
    .validateAsync(data, { abortEarly: false })
    .then((result) => db.playing_list(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};

// Played
exports.played_list = async function (req, res, next) {
  req.body.user_id = req.session.user.user_id;
  validate.played_list
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.played_list(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};

// Details
exports.details_round_list = async function (req, res, next) {
  req.body.user_id = req.session.user.user_id;
  validate.details_round_list
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.details_round_list(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.details_round_id = async function (req, res, next) {
  req.body.user_id = req.session.user.user_id;
  validate.details_round_id
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.details_round_id(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.details_tournament_id = async function (req, res, next) {
  req.body.user_id = req.session.user.user_id;
  validate.details_tournament_id
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.details_tournament_id(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
