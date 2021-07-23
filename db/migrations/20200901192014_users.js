exports.up = function (knex) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.increments();
    tbl.string('username', 128).notNullable().unique().index();
    tbl.string('password', 512).notNullable();
    tbl.string('email', 128).notNullable().unique();
    tbl.integer('permissions', 8).notNullable().defaultTo(0);
    tbl.timestamps(true, true);
  }).raw(`
      CREATE TABLE IF NOT EXISTS session (
      sid varchar NOT NULL COLLATE "default",
      sess json NOT NULL,
      expire timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid"));
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON session ("expire");
    `);
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users').dropTableIfExists('session');
};
