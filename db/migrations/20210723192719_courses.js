exports.up = function (knex) {
  return knex.schema
    .createTable('course_main', (tbl) => {
      tbl.increments();
      tbl.string('name', 128).notNullable().unique().index();
      tbl.string('address', 128).notNullable();
      tbl.string('phone', 128).notNullable();
      tbl.string('email', 128).notNullable();
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
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('course_holes').dropTableIfExists('course_main');
};
