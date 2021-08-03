const db = require('../queries/qry_play');
const validate = require('../validations/val_play');
const ApiError = require('../error/ApiError');

// Rounds
exports.round_add = async function (req, res, next) {
  req.body.user_id = req.session.user.user_id;
  validate.round_add
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.round_add(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};

// Tournaments
exports.tournament_list = async function (req, res, next) {
  req.body.user_id = req.session.user.user_id;
  validate.tournament_list
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_list(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.tournament_sign_up = async function (req, res, next) {
  req.body.user_id = req.session.user.user_id;
  validate.tournament_sign_up
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_sign_up(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.tournament_get_name = async function (req, res, next) {
  validate.tournament_get_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_get_name(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};

// Score
exports.round_list = async function (req, res, next) {
  let data = { user_id: `${req.session.user.user_id}` };
  validate.round_list
    .validateAsync(data, { abortEarly: false })
    .then((result) => db.round_list(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.round_get_id = async function (req, res, next) {
  req.body.user_id = req.session.user.user_id;
  validate.round_get_id
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.round_get_id(result))
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
  req.body.user_id = req.session.user.user_id;
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
exports.score_upload = async function (req, res, next) {
  validate.score_upload
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.score_upload(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
