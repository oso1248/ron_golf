exports.up = async function (knex) {
  //users
  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
  //Courses
  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON course_main
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON course_holes
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
  await knex.raw(`
    CREATE TRIGGER insert_hole_count_trigger
    AFTER INSERT
    ON course_main
    FOR EACH ROW
    EXECUTE PROCEDURE insert_hole_count();
  `);

  // Delete Old Rows
  await knex.raw(`
    CREATE TRIGGER delete_old_rows_rounds_trigger
    AFTER INSERT
    ON round
    FOR EACH ROW
    EXECUTE PROCEDURE delete_old_rows_rounds();
  `);
  await knex.raw(`
    CREATE TRIGGER delete_old_rows_tournament_main_trigger
    AFTER INSERT
    ON tournament_main
    FOR EACH ROW
    EXECUTE PROCEDURE delete_old_rows_tournament_main();
  `);
};

exports.down = function (knex) {};
