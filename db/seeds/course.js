const data = require('../../data/course_data');

exports.seed = function (knex) {
  return knex('course_main')
    .del()
    .then(() => {
      return knex('course_main').insert(data.course_main);
    })
    .then(() => {
      return knex('course_holes').del();
    })
    .then(() => {
      return knex('course_holes').insert(data.holes);
    });
};
