const db = require('../dbConfig');

// Rounds
async function round_add(data) {
  let { rows } = await db.raw(`
    WITH rows AS (
      INSERT
      INTO round_main (course_id, player_id, round_date)
      VALUES ((SELECT id FROM course_main WHERE name = '${data.course_name}' ), ${data.user_id}, '${data.round_date}')
      RETURNING player_id, course_id, round_date)
    SELECT u.name AS user_name, c.name AS course_name, TO_CHAR( rows.round_date, 'MM-DD-YYYY') AS round_date
    FROM rows
    JOIN users AS u ON u.id = rows.player_id
    JOIN course_main AS c ON c.id = rows.course_id
  `);
  return rows;
}

// Tournament
async function tournament_list(data) {
  let { rows } = await db.raw(`
    SELECT CONCAT_WS(',',main.name, TO_CHAR( main.tournament_date, 'MM-DD-YYYY')) AS tournament_name
    FROM tournament_lineup AS line
    RIGHT JOIN tournament_main AS main ON main.id = line.tournament_id AND line.user_id = ${data.user_id}
    LEFT JOIN users AS use ON use.id = line.user_id
    JOIN course_main AS cor ON cor.id = main.course_id
    WHERE line.user_id IS NULL AND main.tournament_date >= current_date
    ORDER BY TO_CHAR( main.tournament_date, 'MM-DD-YYYY') ASC
  `);
  return rows;
}
async function tournament_sign_up(data) {
  let { rows } = await db.raw(`
    WITH rows AS (
      INSERT
      INTO tournament_lineup (tournament_id, user_id)
      values ((SELECT id FROM tournament_main WHERE name = '${data.tournament_name}' AND tournament_date = '${data.tournament_date}'),${data.user_id})
      RETURNING tournament_id, user_id)
    SELECT c.name AS course_name, u.name AS user_name, t.name AS tournament_name, TO_CHAR(t.tournament_date, 'MM-DD-YYYY') AS tournament_date
    FROM rows
    JOIN users AS u ON u.id = rows.user_id
    JOIN tournament_main AS t on t.id = rows.tournament_id
    JOIN course_main AS c on t.course_id = c.id;
  `);
  return rows;
}
async function tournament_get_name(data) {
  let { rows } = await db.raw(`
    SELECT tor.id, TO_CHAR( tor.tournament_date, 'MM-DD-YYYY') AS tournament_date, CONCAT_WS(',',tor.name, TO_CHAR( tor.tournament_date, 'MM-DD-YYYY')) AS tournament_name, cor.name AS course_name, COUNT(hol.id) AS holes, SUM(hol.hole_par) AS par, SUM(hol.hole_distance) AS distance, cor.rating_course
    FROM course_holes AS hol
    JOIN course_main AS cor ON cor.id = hol.course_id
    JOIN tournament_main AS tor ON tor.course_id = cor.id
	  WHERE tor.name = '${data.tournament_name}' AND tor.tournament_date = '${data.tournament_date}'
    GROUP BY tor.id, TO_CHAR( tor.tournament_date, 'MM-DD-YYYY'), CONCAT_WS(',',tor.name, TO_CHAR( tor.tournament_date, 'MM-DD-YYYY')), cor.name, cor.rating_course
  `);
  return rows;
}

// Score
async function round_list(data) {
  let { rows } = await db.raw(`
    SELECT * FROM
      (SELECT CAST(COALESCE(null, 0) AS INT) AS round_id, main.id AS tournament_id, TO_CHAR( main.tournament_date, 'MM-DD-YYYY') AS round_date, main.name AS round_name, cor.name AS course_name
          FROM course_main AS cor
        JOIN course_holes AS hol ON hol.course_id = cor.id
        JOIN tournament_main AS main ON main.course_id = cor.id
        JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
        LEFT JOIN round AS ron ON ron.tournament_id = main.id
        WHERE lin.user_id = ${data.user_id} AND ron.tournament_id IS NULL
        GROUP BY main.id, main.tournament_date, main.name, cor.name
      UNION ALL
      SELECT ron.id AS round_id, CAST(COALESCE(null, 0) AS INT) AS tournament_id, TO_CHAR( ron.round_date, 'MM-DD-YYYY') AS round_date, CAST(COALESCE(null, 'private round') AS VARCHAR) AS round_name,  cor.name AS course_name
          FROM course_main AS cor
          JOIN course_holes AS hol ON hol.course_id = cor.id
          JOIN round_main AS ron ON ron.course_id = cor.id
          LEFT JOIN round AS ply ON ply.player_id = ron.player_id AND ply.round_id = ron.id
          WHERE ron.player_id = ${data.user_id} AND ply.round_id IS NULL
          GROUP BY ron.id, ron.round_date, CAST(COALESCE(null, 'private round') AS VARCHAR), cor.name) AS z
    ORDER BY z.round_date ASC
  `);
  return rows;
}
async function round_get_id(data) {
  let { rows } = await db.raw(`
    SELECT cor.name AS course_name, TO_CHAR( main.round_date, 'MM-DD-YYYY') AS round_date, CAST(COALESCE(null, 'private round') AS VARCHAR) AS round_name, hol.hole_number, hol.hole_par, cor.id AS course_id, use.id AS player_id, hol.id AS hole_id, CAST(COALESCE(null, 0) AS INT) AS tournament_id, main.id AS round_id, CAST(COALESCE(null, 0) AS INT) AS strokes, use.handicap 
    FROM round_main AS main
    JOIN course_main AS cor ON cor.id = main.course_id
    JOIN course_holes AS hol ON hol.course_id = cor.id
    JOIN users AS use ON use.id = main.player_id 
    WHERE main.id = ${data.round_id} AND main.player_id = ${data.user_id}
  `);
  return rows;
}
async function tournament_get_id(data) {
  let { rows } = await db.raw(`
    SELECT cor.name AS course_name, TO_CHAR( main.tournament_date, 'MM-DD-YYYY') AS round_date, main.name AS round_name, hol.hole_number, hol.hole_par, cor.id AS course_id, use.id AS player_id, hol.id AS hole_id, main.id AS tournament_id, CAST(COALESCE(null, 0) AS INT) AS round_id, CAST(COALESCE(null, 0) AS INT) AS strokes, use.handicap 
    FROM tournament_lineup AS lin
    JOIN tournament_main AS main ON main.id = lin.tournament_id
    JOIN course_main AS cor ON cor.id = main.course_id
    JOIN course_holes AS hol ON hol.course_id = cor.id
    JOIN users AS use ON use.id = lin.user_id 
    WHERE main.id = ${data.tournament_id} AND lin.user_id = ${data.user_id}	
  `);
  return rows;
}
async function score_upload(data) {
  let { rows } = await db.raw(`
    WITH rows AS (
    INSERT
      INTO round (course_id, player_id, hole_id, tournament_id, round_id, strokes, user_handicap)
      VALUES ${data.values}
      RETURNING course_id, hole_id)
    SELECT main.name, COUNT(hole_id)
    FROM rows
    JOIN course_main AS main ON main.id = rows.course_id
    GROUP BY main.name
  `);
  return rows;
}

module.exports = {
  // Round
  round_add,
  // Tournament
  tournament_list,
  tournament_sign_up,
  tournament_get_name,
  // Score
  round_list,
  round_get_id,
  tournament_get_id,
  score_upload,
};
