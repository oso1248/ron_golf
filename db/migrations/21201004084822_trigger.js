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
};

exports.down = function (knex) {};
