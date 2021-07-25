exports.up = function (knex) {
  // return knex.schema.createTable('course', (tbl) => {
  //   tbl.increments();
  //   tbl.string('name', 128).notNullable().unique().index();
  //   tbl.string('address', 512).notNullable();
  //   tbl.string('phone', 128).notNullable()
  //   tbl.string('email', 128).notNullable();
  //   tbl.integer('holes', 8).notNullable().defaultTo(0);
  //   tbl.timestamps(true, true);
  // });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('course');
};
