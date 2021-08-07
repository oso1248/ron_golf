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

  // Update handicap
  await knex.raw(`
   CREATE OR REPLACE FUNCTION update_user_handicap() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    DECLARE 
	    user_id INTEGER;
    BEGIN

	    user_id = new.player_id;

      UPDATE users
      SET handicap = (
        SELECT FLOOR(AVG(q.handicap))
        FROM
          (SELECT z.handicap
          FROM
            (SELECT SUM(ron.strokes) - SUM(hol.hole_par) AS handicap
            FROM users AS use
            JOIN round AS ron ON ron.player_id = use.id
            JOIN course_holes AS hol ON hol.id = ron.hole_id
            WHERE ron.player_id = 1
            GROUP BY ron.course_id, ron.created_at
            ORDER BY ron.created_at DESC
            LIMIT 20) AS z
            ORDER BY z.handicap ASC
            LIMIT 8) AS q)
      WHERE id = user_id;

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

  // Delete Old Rows
  await knex.raw(`
    CREATE OR REPLACE FUNCTION delete_old_rows_rounds() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
      DELETE FROM round WHERE created_at < NOW() - INTERVAL '1095 days';
      RETURN NULL;
    END;
    $$;
  `);

  await knex.raw(`
    CREATE OR REPLACE FUNCTION delete_old_rows_tournament_main() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
      DELETE FROM tournament_main WHERE created_at < NOW() - INTERVAL '1095 days';
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
  await knex.raw(`
    DROP FUNCTION IF EXISTS delete_old_rows_rounds() CASCADE;
  `);
  await knex.raw(`
    DROP FUNCTION IF EXISTS delete_old_rows_tournament_main() CASCADE;
  `);
};
