exports.up = async function (knex) {
  //users
  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
  await knex.raw(`
    CREATE TRIGGER update_handicap_round
    AFTER INSERT
    ON round_main
    FOR EACH ROW
    EXECUTE PROCEDURE update_user_handicap();
  `);
  await knex.raw(`
    CREATE TRIGGER update_handicap_tournament
    AFTER INSERT
    ON tournament_lineup
    FOR EACH ROW
    EXECUTE PROCEDURE update_user_handicap();
  `);

  await knex.raw(`
    CREATE TRIGGER set_round_handicap
    AFTER INSERT
    ON round
    FOR EACH ROW
    EXECUTE PROCEDURE update_round_handicap();
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
  await knex.raw(`
    CREATE TRIGGER delete_old_tournament_main_trigger
    AFTER INSERT
    ON tournament_main
    FOR EACH ROW
    EXECUTE PROCEDURE delete_old__tournament_main();
  `);
  await knex.raw(`
    CREATE TRIGGER delete_old_rows_round_main_trigger
    AFTER INSERT
    ON round_main
    FOR EACH ROW
    EXECUTE PROCEDURE delete_old_round_main();
  `);
};

exports.down = function (knex) {};
