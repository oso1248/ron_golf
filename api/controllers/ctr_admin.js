const db = require('../queries/qry_admin');
const validate = require('../validations/val_admin');
const ApiError = require('../error/ApiError');
const func = require('../functions/fcn_admin');
const { valid } = require('joi');

// Users
exports.user_view = async function (req, res, next) {
  validate.user_view
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.user_view())
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.user_add = async function (req, res, next) {
  validate.user_add
    .validateAsync(req.body, { abortEarly: false })
    .then(async (result) => func.hash_password(result, 6))
    .then((user) => db.user_add(user))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.user_get_username = async function (req, res, next) {
  validate.user_get_username
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.user_get_username(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.user_get_email = async function (req, res, next) {
  validate.user_get_email
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.user_get_email(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.user_get_name = async function (req, res, next) {
  validate.user_get_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.user_get_name(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.user_update_name = async function (req, res, next) {
  validate.user_update_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.user_update_name(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.user_delete_name = async function (req, res, next) {
  validate.user_delete_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.user_delete_name(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};

// Courses
exports.course_view = async function (req, res, next) {
  validate.course_view
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.course_view(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.course_add = async function (req, res, next) {
  func
    .get_coords(req.body)
    .then((result) => validate.course_add.validateAsync(result, { abortEarly: false }))
    .then((course) => db.course_add(course))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });

  // validate.course_add
  //   .validateAsync(req.body, { abortEarly: false })
  //   .then((result) => db.course_add(result))
  //   .then((response) => res.status(200).json({ details: response }))
  //   .catch((err) => {
  //     if (err.name === `ValidationError`) {
  //       next(ApiError.badRequest(err));
  //     } else {
  //       next(err);
  //     }
  //   });
};
exports.course_get_email = async function (req, res, next) {
  validate.course_get_email
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.course_get_email(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.course_get_name = async function (req, res, next) {
  validate.course_get_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.course_get_name(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.course_update_name = async function (req, res, next) {
  validate.course_update_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.course_update_name(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.course_delete_name = async function (req, res, next) {
  validate.course_delete_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.course_delete_name(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};

// Holes
exports.hole_get_name = async function (req, res, next) {
  validate.hole_get_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.hole_get_name(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.hole_update_name = async function (req, res, next) {
  validate.hole_update_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.hole_update_name(result))
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
exports.tournament_view = async function (req, res, next) {
  validate.tournament_view
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_view(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.tournament_add = async function (req, res, next) {
  validate.tournament_add
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_add(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        console.log(err);
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.tournament_get_name_date = async function (req, res, next) {
  validate.tournament_get_name_date
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_get_name_date(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        console.log(err);
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
exports.tournament_delete_name = async function (req, res, next) {
  validate.tournament_delete_name
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.tournament_delete_name(result))
    .then((response) => res.status(200).json({ details: response }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        console.log(err);
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
