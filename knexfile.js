// postgres command to change timezone
// heroku pg:psql -a bud-ftc
// ALTER DATABASE dsoqv0oii907c  SET timezone = 'America/Boise';

module.exports = {
  development: {
    client: 'pg',
    useNullAsDefault: true,
    connection: 'postgres://localhost/test',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },

  production: {
    client: 'pg',
    useNullAsDefault: true,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      tablename: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};
