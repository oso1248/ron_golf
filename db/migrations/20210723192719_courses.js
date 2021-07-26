exports.up = function (knex) {
  return knex.schema
    .createTable('course_main', (tbl) => {
      tbl.increments();
      tbl.string('name', 128).notNullable().unique().index();
      tbl.string('address', 512).notNullable();
      tbl.string('phone', 128).notNullable();
      tbl.string('email', 128).notNullable();
      tbl.integer('par', 8).notNullable().defaultTo(0);
      tbl.decimal('rating_course', 8, 2).notNullable().defaultTo(0);
      tbl.decimal('rating_slope', 8, 2).notNullable().defaultTo(0);
      tbl.integer('series', 8).notNullable().defaultTo(0);
      tbl.timestamps(true, true);
    })
    .createTable('course_series_rating', (tbl) => {
      tbl.increments();
      tbl.integer('course_id').unsigned().notNullable().references('id').inTable('course_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('series', 8).notNullable().defaultTo(0);
      tbl.decimal('rating_', 8, 2).defaultTo(0);
      tbl.timestamps(true, true);
    })
    .createTable('course_holes', (tbl) => {
      tbl.increments();
      tbl.integer('course_id').unsigned().notNullable().references('id').inTable('course_main').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('series', 8).notNullable().defaultTo(0);
      tbl.integer('hr1', 8).notNullable().defaultTo(0);
      tbl.integer('hd1', 8).notNullable().defaultTo(0);
      tbl.integer('hr2', 8).notNullable().defaultTo(0);
      tbl.integer('hd2', 8).notNullable().defaultTo(0);
      tbl.integer('hr3', 8).notNullable().defaultTo(0);
      tbl.integer('hd3', 8).notNullable().defaultTo(0);
      tbl.integer('hr4', 8).notNullable().defaultTo(0);
      tbl.integer('hd4', 8).notNullable().defaultTo(0);
      tbl.integer('hr5', 8).notNullable().defaultTo(0);
      tbl.integer('hd5', 8).notNullable().defaultTo(0);
      tbl.integer('hr6', 8).notNullable().defaultTo(0);
      tbl.integer('hd6', 8).notNullable().defaultTo(0);
      tbl.integer('hr7', 8).notNullable().defaultTo(0);
      tbl.integer('hd7', 8).notNullable().defaultTo(0);
      tbl.integer('hr8', 8).notNullable().defaultTo(0);
      tbl.integer('hd8', 8).notNullable().defaultTo(0);
      tbl.integer('hr9', 8).notNullable().defaultTo(0);
      tbl.integer('hd9', 8).notNullable().defaultTo(0);
      tbl.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('course_holes').dropTableIfExists('course_ratings').dropTableIfExists('course_main');
};
