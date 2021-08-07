const db = require('../queries/qry_home');
const validate = require('../validations/val_home');
const ApiError = require('../error/ApiError');

exports.course_next_weather = async function (req, res, next) {
  req.body.user_id = req.session.user.user_id;
  validate.course_next
    .validateAsync(req.body, { abortEarly: false })
    .then((result) => db.course_next(result))
    .then((response) => db.course_next_weather(response))
    .then((send_data) => res.status(200).json({ details: send_data }))
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(ApiError.badRequest(err));
      } else {
        next(err);
      }
    });
};
