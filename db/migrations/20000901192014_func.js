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

  // User handicap
  await knex.raw(`
   CREATE OR REPLACE FUNCTION update_user_handicap() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    DECLARE 
	    id_user INTEGER;
    BEGIN

	    id_user = new.user_id;

      if (
        SELECT COUNT(*)
        FROM
        (SELECT SUM(ron.strokes) - SUM(hol.hole_par) AS handicap
        FROM users AS use
        JOIN round AS ron ON ron.user_id = use.id
        JOIN course_holes AS hol ON hol.id = ron.hole_id
        WHERE ron.user_id = id_user
        GROUP BY ron.course_id, ron.created_at
        ORDER BY ron.created_at DESC
        LIMIT 20) AS c
      ) = 3

      THEN

        UPDATE users
        SET handicap = (
          SELECT FLOOR(AVG(q.handicap))
          FROM
            (SELECT z.handicap
            FROM
              (SELECT SUM(ron.strokes) - SUM(hol.hole_par) AS handicap
              FROM users AS use
              JOIN round AS ron ON ron.user_id = use.id
              JOIN course_holes AS hol ON hol.id = ron.hole_id
              WHERE ron.user_id = id_user
              GROUP BY ron.course_id, ron.created_at
              ORDER BY ron.created_at DESC
              LIMIT 20) AS z
              ORDER BY z.handicap ASC
              LIMIT 8) AS q)
        WHERE id = id_user;

      END IF;
      
    RETURN null;
    END;
    $$;
  `);

  await knex.raw(`
   CREATE OR REPLACE FUNCTION update_round_handicap() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    DECLARE 
	    ron_id INTEGER;
    BEGIN

	    ron_id = new.id;

      UPDATE round
      SET user_handicap = 
        (SELECT FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + (cor.rating_course - SUM(hol.hole_par)))
        FROM round as ron
        JOIN course_main AS cor ON cor.id = ron.course_id
        JOIN course_holes AS hol ON hol.course_id = cor.id
        WHERE ron.id = ron_id
        GROUP BY ron.user_handicap, cor.rating_slope, cor.rating_course)
      WHERE id = ron_id;

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
    CREATE OR REPLACE FUNCTION delete_old_round_main() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
      DELETE FROM round_main WHERE id IN 
      (SELECT main.id
      FROM round_main AS main
      FULL JOIN round AS ron ON ron.round_id = main.id
      WHERE ron.round_id IS NULL AND main.round_date < CURRENT_DATE);
    RETURN NULL;
    END;
    $$;
  `);
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
    CREATE OR REPLACE FUNCTION delete_old__tournament_main() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
    
      DELETE FROM tournament_main WHERE id IN
      (SELECT main.id
      FROM tournament_main AS main
      LEFT JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
      LEFT JOIN round AS ron ON ron.tournament_id = main.id
      WHERE ron.tournament_id IS NULL AND main.tournament_date < CURRENT_DATE);

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
