exports.up = function (knex) {
  return knex.schema
    .createTable('tournament_main', (tbl) => {
      tbl.increments();
      tbl.integer('course_id').unsigned().notNullable().references('id').inTable('course_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.string('name', 128).notNullable().unique().index();
      tbl.date('tournament_date', 128).notNullable();
      tbl.timestamps(true, true);
    })
    .createTable('rounds', (tbl) => {
      tbl.increments();
      tbl.integer('course_id').unsigned().notNullable().references('id').inTable('course_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('player_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('hole_id').unsigned().notNullable().references('id').inTable('course_holes').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('tournament_id').unsigned().references('id').inTable('tournament_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('strokes', 8).notNullable().defaultTo(0);
      tbl.integer('user_handicap', 8).notNullable().defaultTo(0);
      tbl.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('rounds').dropTableIfExists('tournament_main');
};
