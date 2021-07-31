const db = require('../dbConfig');

// Courses
async function course_view() {
  let { rows } = await db.raw(`
    SELECT cor.name, cor.address, cor.phone, cor.email, cor.hole_count, SUM(hol.hole_par) AS par, SUM(hol.hole_distance) AS distance, cor.rating_course, cor.rating_slope, TO_CHAR(cor.created_at, 'MM/DD/YYYY') AS created_at
    FROM course_main AS cor
    JOIN course_holes AS hol ON hol.course_id = cor.id
    GROUP BY cor.name, cor.address, cor.phone, cor.email, cor.hole_count, cor.rating_course, cor.rating_slope, TO_CHAR(cor.created_at, 'MM/DD/YYYY')
    ORDER BY cor.name
  `);
  return rows;
}

// Holes
async function hole_get_name(data) {
  let { rows } = await db.raw(`
    SELECT cor.id AS course_id, cor.name, hol.id AS hole_id, hol.hole_number, hol.hole_par, hol.hole_distance, hol.hole_handicap
    FROM course_main AS cor
    JOIN course_holes AS hol ON hol.course_id = cor.id
    WHERE cor.name = '${data.name}'
    ORDER BY hol.hole_number;
  `);
  return rows;
}

module.exports = {
  // Courses
  course_view,
  // Holes
  hole_get_name,
};
