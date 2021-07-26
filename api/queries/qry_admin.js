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
};
