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
    SET email = '${data.email}', phone = '${data.phone}', handicap = '${data.handicap}'
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
module.exports = {
  user_view,
  user_add,
  user_get_username,
  user_get_email,
  user_get_name,
  user_update_name,
  user_delete_name,
};
