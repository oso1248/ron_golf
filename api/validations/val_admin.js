const { date } = require('joi');
const Joi = require('joi');

// Users
const user_view = Joi.object({
  view: Joi.string().valid(true),
});
const user_add = Joi.object({
  username: Joi.string()
    // .pattern(new RegExp(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/))
    .pattern(new RegExp(/^(?=.*\d).{8,}$/))
    .required(),
  name: Joi.string()
    .pattern(new RegExp(/^\b(?!.*?\s{2})[A-Za-z ]{4,50}\b$/))
    .required(),
  email: Joi.string()
    .lowercase()
    .pattern(new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/))
    .required(),
  handicap: Joi.number().integer().min(0).max(100),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/))
    .required(),
  password2: Joi.ref(`password`),
});
const user_get_username = Joi.object({
  username: Joi.string().required(),
});
const user_get_email = Joi.object({
  email: Joi.string().required(),
});
const user_get_name = Joi.object({
  name: Joi.string().required(),
});
const user_update_name = Joi.object({
  name: Joi.string()
    .pattern(new RegExp(/^\b(?!.*?\s{2})[A-Za-z ]{4,50}\b$/))
    .required(),
  email: Joi.string()
    .lowercase()
    .pattern(new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/))
    .required(),
  handicap: Joi.number().integer().min(0).max(100),
  permissions: Joi.number().integer().min(1).max(5),
});
const user_delete_name = Joi.object({
  name: Joi.string().required(),
});

// Courses
const course_view = Joi.object({
  view: Joi.string().valid(true),
});
const course_add = Joi.object({
  name: Joi.string()
    .pattern(new RegExp(/^[0-9A-Za-z ]{1,100}$/))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/))
    .required(),
  email: Joi.string()
    .lowercase()
    .pattern(new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
    .required(),
  rating_course: Joi.string()
    .pattern(new RegExp(/^\d{0,3}(\.\d{1,2})?$/))
    .required(),
  rating_slope: Joi.string()
    .pattern(new RegExp(/^\d{0,3}(\.\d{1,2})?$/))
    .required(),
  hole_count: Joi.string()
    .pattern(new RegExp(/9|18|27/))
    .required(),
  address: Joi.string()
    // .pattern(new RegExp(/^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/))
    .pattern(new RegExp(/^[A-Za-z0-9 ]{1,120}$/))
    .required(),
});
const course_get_email = Joi.object({
  email: Joi.string()
    .lowercase()
    .pattern(new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
    .required(),
});
const course_get_name = Joi.object({
  name: Joi.string().required(),
});
const course_update_name = Joi.object({
  name: Joi.string()
    .pattern(new RegExp(/^[0-9A-Za-z ]{1,100}$/))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/))
    .required(),
  email: Joi.string()
    .lowercase()
    .pattern(new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
    .required(),
  rating_course: Joi.string()
    .pattern(new RegExp(/^\d{0,3}(\.\d{1,2})?$/))
    .required(),
  rating_slope: Joi.string()
    .pattern(new RegExp(/^\d{0,3}(\.\d{1,2})?$/))
    .required(),
});
const course_delete_name = Joi.object({
  name: Joi.string().required(),
});

// Holes
const hole_get_name = Joi.object({
  name: Joi.string().required(),
});

const hole_update_name = Joi.object({
  values: Joi.string().required(),
});

// Tournaments
const tournament_view = Joi.object({
  view: Joi.string().valid(true),
});
const tournament_add = Joi.object({
  tournament_name: Joi.string()
    .pattern(new RegExp(/^(?=.{8})(.*[^0-9a-zA-Z].*)$/))
    .required(),
  course_name: Joi.string()
    .pattern(new RegExp(/^[0-9A-Za-z ]{1,100}$/))
    .required(),
  tournament_date: Joi.string()
    .pattern(new RegExp(/^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})/))
    .required(),
});
const tournament_get_name_date = Joi.object({
  tournament_name: Joi.string().required(),
  tournament_date: Joi.string().required(),
});
const tournament_delete_name = Joi.object({
  id: Joi.number().integer(),
});

module.exports = {
  //User
  user_view,
  user_add,
  user_get_username,
  user_get_email,
  user_get_name,
  user_update_name,
  user_delete_name,
  // Course
  course_view,
  course_add,
  course_get_email,
  course_get_name,
  course_update_name,
  course_delete_name,
  // Holes
  hole_get_name,
  hole_update_name,
  // Tournaments
  tournament_add,
  tournament_view,
  tournament_get_name_date,
  tournament_delete_name,
};
