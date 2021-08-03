const db = require('../dbConfig');

// Playing
async function playing_list(data) {
  let { rows } = await db.raw(`
    SELECT * FROM
      (SELECT TO_CHAR(main.tournament_date, 'mm-dd-yyyy') AS round_date, main.name AS round_name, cor.name AS course_name, cor.hole_count, SUM(hol.hole_par) AS course_par, SUM(hol.hole_distance) AS course_distance, cor.rating_course, SUM(hol.hole_par) AS hole_par, use.handicap AS user_handicap,
            FLOOR((use.handicap * (cor.rating_slope / 113)) + (cor.rating_course - SUM(hol.hole_par))) AS course_handicap
      FROM course_main AS cor
      JOIN course_holes AS hol ON hol.course_id = cor.id
      JOIN tournament_main AS main ON main.course_id = cor.id
      JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
      JOIN users AS use ON use.id = lin.user_id
      LEFT JOIN round AS ron ON ron.tournament_id = main.id AND ron.hole_id = hol.id
      WHERE use.id = ${data.user_id} AND ron.round_id IS NULL
      GROUP BY main.tournament_date, main.name, cor.name, cor.hole_count, cor.rating_course, use.handicap, cor.rating_slope, cor.rating_course, use.handicap
    UNION ALL
      SELECT TO_CHAR(main.round_date, 'mm-dd-yyyy') AS round_date, CAST(COALESCE(null, 'private round') AS VARCHAR) AS round_name, cor.name AS course_name, cor.hole_count, SUM(hol.hole_par) AS course_par, SUM(hol.hole_distance) AS course_distance, cor.rating_course, SUM(hol.hole_par) AS hole_par, use.handicap AS user_handicap,
            FLOOR((use.handicap * (cor.rating_slope / 113)) + cor.rating_course - SUM(hol.hole_par)) AS course_handicap
      FROM course_main AS cor
      JOIN course_holes AS hol ON hol.course_id = cor.id
      JOIN round_main AS main ON main.course_id = cor.id
      JOIN users AS use ON use.id = main.player_id
      LEFT JOIN round AS ron ON ron.round_id = main.id AND ron.hole_id = hol.id
      WHERE use.id = ${data.user_id} AND ron.round_id IS NULL
      GROUP BY main.round_date, cor.name, cor.hole_count, cor.rating_course, use.handicap, cor.rating_slope, cor.rating_course, use.handicap) AS z
    ORDER BY z.round_date DESC, z.round_name DESC
  `);
  return rows;
}

// Played
async function played_list(data) {
  let { rows } = await db.raw(`
    SELECT * FROM 
      (SELECT TO_CHAR(main.tournament_date, 'mm-dd-yyyy') AS round_date, main.name AS round_name, cor.name AS course_name, cor.hole_count, SUM(hol.hole_par) AS course_par, SUM(hol.hole_distance) AS course_distance, cor.rating_course, SUM(hol.hole_par) AS hole_par, SUM(ron.strokes) AS strokes_up, SUM(ron.strokes) -
            FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + (cor.rating_course - SUM(hol.hole_par))) AS strokes_adjusted,
            FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + (cor.rating_course - SUM(hol.hole_par))) AS course_handicap
      FROM course_main AS cor
      JOIN course_holes AS hol ON hol.course_id = cor.id
      JOIN tournament_main AS main ON main.course_id = cor.id
      JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
      JOIN users AS use ON use.id = lin.user_id
      JOIN round AS ron ON ron.tournament_id = main.id AND ron.hole_id = hol.id
      WHERE lin.user_id = ${data.user_id}
      GROUP BY main.tournament_date, main.name, cor.name, cor.hole_count, cor.rating_course, ron.user_handicap, cor.rating_slope, cor.rating_course
    UNION ALL
      SELECT TO_CHAR(main.round_date, 'mm-dd-yyyy') AS round_date, CAST(COALESCE(null, 'private round') AS VARCHAR) AS round_name, cor.name AS course_name, cor.hole_count, SUM(hol.hole_par) AS course_par, SUM(hol.hole_distance) AS course_distance, cor.rating_course, SUM(hol.hole_par) AS hole_par, SUM(ron.strokes) AS strokes_up, SUM(ron.strokes) - 
            FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + cor.rating_course - SUM(hol.hole_par)) AS strokes_adjusted,
            FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + cor.rating_course - SUM(hol.hole_par)) AS course_handicap
      FROM course_main AS cor
      JOIN course_holes AS hol ON hol.course_id = cor.id
      JOIN round_main AS main ON main.course_id = cor.id
      JOIN users AS use ON use.id = main.player_id
      JOIN round AS ron ON ron.round_id = main.id AND ron.hole_id = hol.id
      WHERE ron.player_id = ${data.user_id}
      GROUP BY main.round_date, cor.name, cor.hole_count, cor.rating_course, ron.user_handicap, cor.rating_slope, cor.rating_course) AS z
    ORDER BY z.round_date DESC, z.round_name DESC
    LIMIT 100
  `);
  return rows;
}

// Details
async function details_round_list(data) {
  let { rows } = await db.raw(`
    SELECT * FROM
      (SELECT CAST(COALESCE(null, 0) AS INT) AS round_id, main.id AS tournament_id, TO_CHAR(main.tournament_date, 'MM-DD-YYYY') AS round_date, main.name AS round_name
      FROM course_main AS cor
      JOIN course_holes AS hol ON hol.course_id = cor.id
      JOIN tournament_main AS main ON main.course_id = cor.id
      JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
      JOIN users AS use ON use.id = lin.user_id
      JOIN round AS ron ON ron.tournament_id = main.id AND ron.hole_id = hol.id
      WHERE lin.user_id = ${data.user_id}
      GROUP BY main.id, main.tournament_date, main.name
    UNION ALL
      SELECT main.id AS round_id, CAST(COALESCE(null, 0) AS INT) AS tournament_id, TO_CHAR(main.round_date, 'MM-DD-YYYY') AS round_date, CAST(COALESCE(null, 'private round') AS VARCHAR) AS round_name
      FROM course_main AS cor
      JOIN course_holes AS hol ON hol.course_id = cor.id
      JOIN round_main AS main ON main.course_id = cor.id
      JOIN users AS use ON use.id = main.player_id
      JOIN round AS ron ON ron.round_id = main.id AND ron.hole_id = hol.id
      WHERE ron.player_id = ${data.user_id}
      GROUP BY main.id, main.round_date) AS z
    ORDER BY z.round_date ASC, z.round_name DESC
  `);
  return rows;
}
async function details_round_id(data) {
  let { rows } = await db.raw(`
    SELECT TO_CHAR(main.round_date, 'mm-dd-yyyy') AS round_date, CAST(COALESCE(null, 'private round') AS VARCHAR) AS round_name, cor.name AS course_name, hol.hole_number, hol.hole_par, hol.hole_handicap, ron.strokes AS strokes_up, ron.strokes AS strokes_adjusted,
      FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + cor.rating_course - 
      (SELECT SUM(hol.hole_par)
      FROM course_main AS cor
      JOIN course_holes AS hol ON hol.course_id = cor.id
      JOIN round_main AS main ON main.course_id = cor.id
      JOIN users AS use ON use.id = main.player_id
      JOIN round AS ron ON ron.round_id = main.id AND ron.hole_id = hol.id
      WHERE ron.player_id = ${data.user_id} AND ron.round_id = ${data.round_id})) AS course_handicap
        
    FROM course_main AS cor
    JOIN course_holes AS hol ON hol.course_id = cor.id
    JOIN round_main AS main ON main.course_id = cor.id
    JOIN users AS use ON use.id = main.player_id
    JOIN round AS ron ON ron.round_id = main.id AND ron.hole_id = hol.id
    WHERE ron.player_id = ${data.user_id} AND ron.round_id = ${data.round_id}
    ORDER BY hol.hole_handicap
  `);
  return rows;
}
async function details_tournament_id(data) {
  let { rows } = await db.raw(`
    SELECT TO_CHAR(main.tournament_date, 'mm-dd-yyyy') AS round_date, main.name AS round_name, cor.name AS course_name, hol.hole_number, hol.hole_par, hol.hole_handicap, ron.strokes AS strokes_up, ron.strokes AS strokes_adjusted,
      FLOOR((ron.user_handicap * (cor.rating_slope / 113)) + (cor.rating_course - 
      (SELECT SUM(hol.hole_par)
      FROM course_main AS cor
      JOIN course_holes AS hol ON hol.course_id = cor.id
      JOIN tournament_main AS main ON main.course_id = cor.id
      JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
      JOIN users AS use ON use.id = lin.user_id
      JOIN round AS ron ON ron.tournament_id = main.id AND ron.hole_id = hol.id
      WHERE lin.user_id = ${data.user_id} AND ron.tournament_id = ${data.tournament_id}))) AS course_handicap
      
    FROM course_main AS cor
    JOIN course_holes AS hol ON hol.course_id = cor.id
    JOIN tournament_main AS main ON main.course_id = cor.id
    JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
    JOIN users AS use ON use.id = lin.user_id
    JOIN round AS ron ON ron.tournament_id = main.id AND ron.hole_id = hol.id
    WHERE lin.user_id = ${data.user_id} AND ron.tournament_id = ${data.tournament_id}
    ORDER BY hol.hole_handicap
  `);
  return rows;
}

module.exports = {
  // Playing
  playing_list,
  // Played
  played_list,
  // Details
  details_round_list,
  details_round_id,
  details_tournament_id,
};
