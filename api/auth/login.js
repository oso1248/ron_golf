const schema = require('./valAuth');
const express = require('express');
const db = require('../dbConfig');
const bcrypt = require('bcryptjs');
// const { json } = require('express');
const router = express.Router();

async function getPass(name) {
  let { rows } = await db.raw(`
    SELECT username, "password", permissions
    FROM users
    WHERE username = '${name}'
  `);
  return rows;
}

async function getUser(data) {
  let { rows } = await db.raw(`
    SELECT username
    FROM users
    WHERE username = '${data}'
  `);
  return rows;
}

async function getEmail(data) {
  let { rows } = await db.raw(`
    SELECT email
    FROM users
    WHERE email = '${data}'
  `);
  return rows;
}

async function deleteSess(name) {
  await db.raw(`
    DELETE
    FROM session
    WHERE sess -> 'user' ->> 'username' = '${name}'
  `);
  return { msg: 'null' };
}

async function registerUser(data) {
  let { rows } = await db.raw(`
    INSERT
    INTO users (username, email, password, permissions)
    VALUES ('${data.username}', '${data.email}', '${data.password}', ${data.permissions})
    RETURNING username, permissions
  `);

  return rows;
}

// -> /api/login
router.post('/login', async (req, res) => {
  let resStatus = 200;
  try {
    const result = await schema.login.validateAsync(req.body);

    let user = await getPass(result.username);
    user = user[0];
    console.log(user.password);
    if (user && bcrypt.compareSync(result.password, user.password)) {
      req.session.user = {
        username: user.username,
        permissions: user.permissions,
      };
      res.status(resStatus).json({ details: [{ message: 'pass', permissions: req.session.user.permissions }] });
    } else {
      let err = { details: [{ message: 'Invalid Credentials' }] };
      throw err;
    }
  } catch (err) {
    console.log(err);
    res.status(resStatus).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (!req.session.user) {
    res.status(200).json({ msg: 'no user' });
    return;
  }
  deleteSess(req.session.user.username).then((data) => {
    req.session.destroy((error) => {
      if (error) {
        res.status(500).json({ msg: `You Can Checkout Anytime But You Can Never Leave` });
      } else {
        res.status(200).json({ msg: 'goodbye' });
      }
    });
  });
});

router.post('/register', async (req, res) => {
  let resStatus = 200;
  try {
    let result = await schema.register.validateAsync(req.body);
    result.password = bcrypt.hashSync(req.body.password, 6);
    result.permissions = 1;
    let resp = await registerUser(result);
    resp[0].message = `pass`;
    req.session.user = {
      username: resp[0].username,
      permissions: resp[0].permissions,
    };

    res.status(resStatus).json({ details: resp });
  } catch (err) {
    res.status(resStatus).json(err);
  }
});

router.post('/register/get/user', async (req, res) => {
  let resStatus = 200;
  try {
    let result = await schema.username.validateAsync(req.body);
    let resp = await getUser(result.username);
    res.status(resStatus).json({ details: resp });
  } catch (err) {
    res.status(resStatus).json(err);
  }
});

router.post('/register/get/email', async (req, res) => {
  let resStatus = 200;
  try {
    let result = await schema.email.validateAsync(req.body);
    let resp = await getEmail(result.email);
    res.status(resStatus).json({ details: resp });
  } catch (err) {
    res.status(resStatus).json(err);
  }
});

module.exports = router;
