const dbEngine = process.env.DB_ENVIRONMENT;
const config = require('../knexfile')[dbEngine];

module.exports = require('knex')(config);
