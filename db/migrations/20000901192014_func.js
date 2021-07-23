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
    DROP FUNCTION IF EXISTS delete_orphan_sessions() CASCADE;
  `);
};
