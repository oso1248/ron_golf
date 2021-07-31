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
  // console.log(rows);
  return rows;
}
module.exports = {
  round_add,
  tournament_list,
  tournament_sign_up,
  tournament_get_name,
};
