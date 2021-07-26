exports.up = async function (knex) {
  // updated_at Function
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$;
  `);

  // Add holes on new course added
  await knex.raw(`
   CREATE OR REPLACE FUNCTION insert_hole_count() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    DECLARE 
	    hole_count INTEGER;
    BEGIN

	    hole_count = new.hole_count;

      FOR i IN 1..hole_count LOOP
        INSERT INTO course_holes (course_id, hole_number) VALUES (new.id, i);
      END LOOP;

    RETURN NULL;
    END;
    $$;
  `);

  // session delete orphan sessions
  await knex.raw(`
    CREATE OR REPLACE FUNCTION delete_orphan_sessions() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
      DELETE FROM session WHERE NOT sess :: text LIKE '%user%';
      RETURN NULL;
    END;
    $$;
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
  `);
  await knex.raw(`
    DROP FUNCTION IF EXISTS insert_hole_count() CASCADE;
  `);
  await knex.raw(`
    DROP FUNCTION IF EXISTS delete_orphan_sessions() CASCADE;
  `);
};
