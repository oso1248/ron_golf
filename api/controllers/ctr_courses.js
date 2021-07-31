const db = require('../queries/qry_courses');
const validate = require('../validations/val_courses');

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
