const { date } = require('joi');
const Joi = require('joi');

// Courses
const course_view = Joi.object({
  view: Joi.string().valid(true),
});

// Holes
const hole_get_name = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  // Courses
  course_view,
  // Holes
  hole_get_name,
};
