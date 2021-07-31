const db = require('../dbConfig');

// Users
async function user_view() {
  let { rows } = await db.raw(`
    SELECT name, email, phone, permissions, handicap, TO_CHAR(created_at, 'MM/DD/YYYY') AS created_at
    FROM users
    WHERE username <> 'admin'
    ORDER BY name;
  `);
  return rows;
}
async function user_add(data) {
  let { rows } = await db.raw(`
    INSERT
    INTO users (username, name, password, email, phone, handicap)
    VALUES ('${data.username}', '${data.name}', '${data.password}', '${data.email}', '${data.phone}', ${data.handicap})
    RETURNING name
  `);
  return rows;
}
async function user_get_username(data) {
  let { rows } = await db.raw(`
    SELECT username, name, email, phone, permissions, handicap, TO_CHAR(created_at, 'MM/DD/YYYY') AS created_at
    FROM users
    WHERE username = '${data.username}';
  `);
  return rows;
}
async function user_get_email(data) {
  let { rows } = await db.raw(`
    SELECT username, name, email, phone, permissions, handicap, TO_CHAR(created_at, 'MM/DD/YYYY') AS created_at
    FROM users
    WHERE email = '${data.email}';
  `);
  return rows;
}
async function user_get_name(data) {
  let { rows } = await db.raw(`
    SELECT username, name, email, phone, permissions, handicap, TO_CHAR(created_at, 'MM/DD/YYYY') AS created_at
    FROM users
    WHERE name = '${data.name}';
  `);
  return rows;
}
async function user_update_name(data) {
  let { rows } = await db.raw(`
    UPDATE users
    SET email = '${data.email}', phone = '${data.phone}', handicap = '${data.handicap}', permissions = ${data.permissions}
    WHERE name = '${data.name}'
    RETURNING name;
  `);
  return rows;
}
async function user_delete_name(data) {
  let { rows } = await db.raw(`
    DELETE
    FROM users
    WHERE name = '${data.name}'
    RETURNING name
  `);
  return rows;
}

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
async function course_add(data) {
  let { rows } = await db.raw(`
    INSERT
    INTO course_main (name, address, phone, email, rating_course, rating_slope, hole_count)
    VALUES ('${data.name}', '${data.address}', '${data.phone}', '${data.email}', ${data.rating_course}, ${data.rating_slope}, ${data.hole_count})
    RETURNING name
  `);
  return rows;
}
async function course_get_email(data) {
  let { rows } = await db.raw(`
    SELECT cor.name, cor.address, cor.phone, cor.email, cor.hole_count, SUM(hol.hole_par) AS par, SUM(hol.hole_distance) AS distance, cor.rating_course, cor.rating_slope, TO_CHAR(cor.created_at, 'MM/DD/YYYY') AS created_at
    FROM course_main AS cor
    JOIN course_holes AS hol ON hol.course_id = cor.id
    WHERE email = '${data.email}'
    GROUP BY cor.name, cor.address, cor.phone, cor.email, cor.hole_count, cor.rating_course, cor.rating_slope, TO_CHAR(cor.created_at, 'MM/DD/YYYY')
  `);
  return rows;
}
async function course_get_name(data) {
  let { rows } = await db.raw(`
    SELECT cor.name, cor.address, cor.phone, cor.email, cor.hole_count, SUM(hol.hole_par) AS par, SUM(hol.hole_distance) AS distance, cor.rating_course, cor.rating_slope, TO_CHAR(cor.created_at, 'MM/DD/YYYY') AS created_at
    FROM course_main AS cor
    JOIN course_holes AS hol ON hol.course_id = cor.id
    WHERE name = '${data.name}'
    GROUP BY cor.name, cor.address, cor.phone, cor.email, cor.hole_count, cor.rating_course, cor.rating_slope, TO_CHAR(cor.created_at, 'MM/DD/YYYY')
  `);
  return rows;
}
async function course_update_name(data) {
  let { rows } = await db.raw(`
    UPDATE course_main
    SET phone = '${data.phone}', email = '${data.email}', rating_course = '${data.rating_course}', rating_slope = '${data.rating_slope}'
    WHERE name = '${data.name}'
    RETURNING name;
  `);
  return rows;
}
async function course_delete_name(data) {
  let { rows } = await db.raw(`
    DELETE
    FROM course_main
    WHERE name = '${data.name}'
    RETURNING name
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
async function hole_update_name(data) {
  let { rows } = await db.raw(`
    WITH rows AS (
    UPDATE course_holes AS h SET
      hole_par = h2.hole_par,
      hole_distance = h2.hole_distance,
      hole_handicap = h2.hole_handicap
    from (values ${data.values}) as h2(id, hole_par, hole_distance, hole_handicap)
    where h2.id = h.id
    RETURNING h.id)
    SELECT COUNT(id) AS count
    FROM rows; 
  `);
  return rows;
}

// Tournaments
async function tournament_view() {
  let { rows } = await db.raw(`
    SELECT tor.id, TO_CHAR( tor.tournament_date, 'MM-DD-YYYY') AS tournament_date, CONCAT_WS(',',tor.name, TO_CHAR( tor.tournament_date, 'MM-DD-YYYY')) AS tournament_name, cor.name AS course_name, COUNT(hol.id) AS holes, SUM(hol.hole_par) AS par, SUM(hol.hole_distance) AS distance, cor.rating_course
    FROM course_holes AS hol
    JOIN course_main AS cor ON cor.id = hol.course_id
    JOIN tournament_main AS tor ON tor.course_id = cor.id
    GROUP BY tor.id, TO_CHAR( tor.tournament_date, 'MM-DD-YYYY'), CONCAT_WS(',',tor.name, TO_CHAR( tor.tournament_date, 'MM-DD-YYYY')), cor.name, cor.rating_course
    ORDER BY TO_CHAR( tor.tournament_date, 'MM-DD-YYYY') ASC
    LIMIT 50;
  `);
  return rows;
}
async function tournament_add(data) {
  let { rows } = await db.raw(`
    INSERT
    INTO tournament_main (course_id, name, tournament_date)
    VALUES ((SELECT id FROM course_main WHERE name = '${data.course_name}'), '${data.tournament_name}', '${data.tournament_date}')
    RETURNING name AS tournament_name, TO_CHAR(tournament_date, 'MM/DD/YYYY') AS tournament_date;
  `);
  return rows;
}
async function tournament_get_name_date(data) {
  let { rows } = await db.raw(`
    SELECT name, tournament_date
    FROM tournament_main
    WHERE name = '${data.tournament_name}' AND tournament_date = '${data.tournament_date}';
  `);
  return rows;
}
async function tournament_delete_name(data) {
  let { rows } = await db.raw(`
    DELETE
    FROM tournament_main
    WHERE id = ${data.id}
    RETURNING name as tournament_name, TO_CHAR(tournament_date, 'MM-DD-YYYY') AS tournament_date;
  `);
  return rows;
}

module.exports = {
  // User
  user_view,
  user_add,
  user_get_username,
  user_get_email,
  user_get_name,
  user_update_name,
  user_delete_name,
  // Course
  course_view,
  course_add,
  course_get_name,
  course_get_email,
  course_get_name,
  course_update_name,
  course_delete_name,
  // Holes
  hole_get_name,
  hole_update_name,
  // Tournaments
  tournament_view,
  tournament_add,
  tournament_get_name_date,
  tournament_delete_name,
};
