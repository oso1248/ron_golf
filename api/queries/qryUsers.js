const db = require('../dbConfig');

async function addUser(data) {
  let { rows } = db.raw(`
    INSERT
    INTO users (username, password, email)
    VALUES (${data.username}, ${data.password},${data.email})
    RETURNING username
  `);
  return rows;
}

module.exports = { addUser };
