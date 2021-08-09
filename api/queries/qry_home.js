const db = require('../dbConfig');
const axios = require('axios');

// Get next up courses
async function course_next() {
  let { rows } = await db.raw(`
    SELECT * FROM
      (SELECT TO_CHAR( main.tournament_date, 'MM-DD-YYYY') AS round_date, main.name AS round_name, cor.name AS course_name, cor.latitude, cor.longitude
          FROM course_main AS cor
        JOIN course_holes AS hol ON hol.course_id = cor.id
        JOIN tournament_main AS main ON main.course_id = cor.id
        JOIN tournament_lineup AS lin ON lin.tournament_id = main.id
        LEFT JOIN round AS ron ON ron.tournament_id = main.id
        WHERE lin.user_id = 1 AND ron.tournament_id IS NULL AND main.tournament_date >= CURRENT_DATE AND main.tournament_date < CURRENT_DATE + 8
        GROUP BY main.id, main.tournament_date, main.name, cor.name, cor.latitude, cor.longitude
      UNION ALL
      SELECT TO_CHAR( ron.round_date, 'MM-DD-YYYY') AS round_date, CAST(COALESCE(null, 'private round') AS VARCHAR) AS round_name,  cor.name AS course_name, cor.latitude, cor.longitude
          FROM course_main AS cor
          JOIN course_holes AS hol ON hol.course_id = cor.id
          JOIN round_main AS ron ON ron.course_id = cor.id
          LEFT JOIN round AS ply ON ply.user_id = ron.user_id AND ply.round_id = ron.id
          WHERE ron.user_id = 1 AND ply.round_id IS NULL AND ron.round_date >= CURRENT_DATE AND ron.round_date < CURRENT_DATE + 8
          GROUP BY ron.id, ron.round_date, CAST(COALESCE(null, 'private round') AS VARCHAR), cor.name, cor.latitude, cor.longitude) AS z
    ORDER BY z.round_date ASC
	  LIMIT 4
  `);
  let details = { courses: rows };
  return details;
}

// Get weather data
async function course_next_weather(data) {
  for (let i = 0; i < data.courses.length; i++) {
    let weather = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.courses[i].latitude}&lon=${data.courses[i].longitude}&units=imperial&appid=${process.env.API_WEATHER}`);
    data.courses[i].weather = weather.data.daily;
  }
  return data;
}

module.exports = {
  course_next,
  course_next_weather,
};
