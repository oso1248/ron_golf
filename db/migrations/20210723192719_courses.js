exports.up = function (knex) {
  return knex.schema
    .createTable('course_main', (tbl) => {
      tbl.increments();
      tbl.string('name', 128).notNullable().unique().index();
      tbl.string('address', 128).notNullable();
      tbl.string('phone', 128).notNullable();
      tbl.string('email', 128).defaultTo('');
      tbl.decimal('rating_course', 8, 2).notNullable().defaultTo(0);
      tbl.decimal('rating_slope', 8, 2).notNullable().defaultTo(0);
      tbl.integer('hole_count', 8).notNullable().defaultTo(0);
      tbl.timestamps(true, true);
    })
    .createTable('course_holes', (tbl) => {
      tbl.increments();
      tbl.integer('course_id').unsigned().notNullable().references('id').inTable('course_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('hole_number', 8).notNullable().defaultTo(0);
      tbl.integer('hole_par', 8).notNullable().defaultTo(0);
      tbl.integer('hole_distance', 8).notNullable().defaultTo(0);
      tbl.integer('hole_handicap', 8).notNullable().defaultTo(0);
      tbl.timestamps(true, true);
    })
    .createTable('round_main', (tbl) => {
      tbl.increments();
      tbl.integer('course_id').unsigned().notNullable().references('id').inTable('course_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('player_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.date('round_date', 128).notNullable();
      tbl.timestamps(true, true);
    })
    .createTable('tournament_main', (tbl) => {
      tbl.increments();
      tbl.integer('course_id').unsigned().notNullable().references('id').inTable('course_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.string('name', 128).notNullable().unique().index();
      tbl.date('tournament_date', 128).notNullable();
      tbl.timestamps(true, true);
    })
    .createTable('tournament_lineup', (tbl) => {
      tbl.increments();
      tbl.integer('tournament_id').unsigned().notNullable().references('id').inTable('tournament_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.timestamps(true, true);
    })
    .createTable('round', (tbl) => {
      tbl.increments();
      tbl.integer('course_id').unsigned().notNullable().references('id').inTable('course_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('player_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('hole_id').unsigned().notNullable().references('id').inTable('course_holes').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('tournament_id').unsigned().references('id').inTable('tournament_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('round_id').unsigned().references('id').inTable('round_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('strokes', 8).notNullable().defaultTo(0);
      tbl.integer('user_handicap', 8).notNullable().defaultTo(0);
      tbl.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('round')
    .dropTableIfExists('tournament_lineup')
    .dropTableIfExists('tournament_main')
    .dropTableIfExists('round_main')
    .dropTableIfExists('course_holes')
    .dropTableIfExists('course_main');
};
