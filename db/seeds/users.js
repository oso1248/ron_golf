const data = require('../../data/usersData');

exports.seed = function (knex) {
  return knex('users')
    .del()
    .then(() => {
      return knex('users').insert(data.user);
    });
};
