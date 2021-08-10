const db = require('../dbConfig');

// Tournament
async function tournament_list() {
  let { rows } = await db.raw(`
    SELECT main.id AS tournament_id, main.name AS tournament_name, TO_CHAR( main.tournament_date, 'MM-DD-YYYY') AS tournament_date
    FROM course_main AS cor
    JOIN course_holes AS hol ON hol.course_id = cor.id
    JOIN tournament_main AS main ON main.course_id = cor.id
    JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
    JOIN users AS use ON use.id = lin.user_id
    JOIN round AS ron ON ron.tournament_id = main.id AND ron.hole_id = hol.id AND ron.user_id = use.id
    GROUP BY main.id, main.name, main.tournament_date
  `);
  return rows;
}
async function tournament_get_id(data) {
  let { rows } = await db.raw(`
    SELECT TO_CHAR(main.tournament_date, 'mm-dd-yyyy') AS tournament_date, cor.name AS course_name
    FROM tournament_main AS main
    JOIN course_main AS cor ON cor.id = main.course_id
    WHERE main.id = ${data.tournament_id}
  `);
  return rows;
}
async function tournament_played_get_id(data) {
  let { rows } = await db.raw(`
    SELECT row_number() over (order by z.tournament_date) as rankings, z.*
    FROM
    (SELECT TO_CHAR(main.tournament_date, 'mm-dd-yyyy') AS tournament_date, main.name AS tournament_name, cor.name AS course_name, use.name AS user_name, cor.hole_count, SUM(hol.hole_par) AS course_par, SUM(hol.hole_distance) AS course_distance, cor.rating_course, SUM(ron.strokes) AS strokes_up, 
          SUM(ron.strokes) - FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + (cor.rating_course - SUM(hol.hole_par))) AS strokes_adjusted,
          FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + (cor.rating_course - SUM(hol.hole_par))) AS course_handicap
        FROM course_main AS cor
        JOIN course_holes AS hol ON hol.course_id = cor.id
        JOIN tournament_main AS main ON main.course_id = cor.id
        JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
        JOIN users AS use ON use.id = lin.user_id
        JOIN round AS ron ON ron.tournament_id = main.id AND ron.hole_id = hol.id AND ron.user_id = use.id
        WHERE main.id = ${data.tournament_id}
        GROUP BY main.tournament_date, main.name, cor.name, use.name, cor.hole_count, cor.rating_course, ron.user_handicap, cor.rating_slope, cor.rating_course
        ORDER BY strokes_adjusted ASC) AS z
  `);
  return rows;
}
async function tournament_details_get_id(data) {
  let { rows } = await db.raw(`
    SELECT TO_CHAR(main.tournament_date, 'mm-dd-yyyy') AS round_date, main.name AS round_name, cor.name AS course_name, use.name AS user_name, cor.hole_count, hol.hole_number, hol.hole_par, hol.hole_handicap, ron.strokes AS strokes_up, ron.strokes AS strokes_adjusted,
      FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + (cor.rating_course - 
      (SELECT SUM(hol.hole_par)
      FROM course_main AS cor
      JOIN course_holes AS hol ON hol.course_id = cor.id
      JOIN tournament_main AS main ON main.course_id = cor.id
      JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
      JOIN users AS use ON use.id = lin.user_id
      JOIN round AS ron ON ron.tournament_id = main.id AND ron.hole_id = hol.id AND ron.user_id = lin.user_id
      WHERE ron.tournament_id = ${data.tournament_id}
	  GROUP BY ron.user_id
	  LIMIT 1))) AS course_handicap
    FROM course_main AS cor
    JOIN course_holes AS hol ON hol.course_id = cor.id
    JOIN tournament_main AS main ON main.course_id = cor.id
    JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
    JOIN users AS use ON use.id = lin.user_id
    JOIN round AS ron ON ron.tournament_id = main.id AND ron.hole_id = hol.id AND ron.user_id = use.id
    WHERE ron.tournament_id = ${data.tournament_id}
	ORDER BY use.name, hol.hole_handicap
  `);
  return rows;
}

module.exports = {
  // Tournament
  tournament_list,
  tournament_get_id,
  tournament_played_get_id,
  tournament_details_get_id,
};
