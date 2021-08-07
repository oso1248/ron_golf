const Joi = require('joi');

const course_next = Joi.object({
  user_id: Joi.number().integer().required(),
});

module.exports = {
  course_next,
};
