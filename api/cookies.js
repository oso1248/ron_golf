const session = require('express-session');
const pgSession = require('connect-pg-simple');

const sessionConfig = session({
  conString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  store: new (pgSession(session))(),
  name: 'BudApp',
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 180,
    secure: false,
    // secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
    sameSite: true,
  },
});

module.exports = {
  sessionConfig,
};
