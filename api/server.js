const express = require('express');
const path = require('path');
const cookie = require('./cookies');

const apiErrorHandler = require('./error/api_error_handler');

const server = express();

const permissions1 = require('./auth/perm1');
const permissions2 = require('./auth/perm2');
const permissions3 = require('./auth/perm3');
const permissions4 = require('./auth/perm4');
const permissions5 = require('./auth/perm5');

const loginRouter = require('./auth/login');
const adminRouter = require('./routes/rts_admin');
const courseRouter = require('./routes/rts_courses');
const playRouter = require('./routes/rts_play');
const meRouter = require('./routes/rts_me');

server.use(express.json());
server.use(cookie.sessionConfig);

server.use(express.static(path.join(__dirname, '../pages/site/login/')));
server.use('/api/auth', loginRouter);
server.use('/', permissions1);
server.use(express.static(path.join(__dirname, '../pages/site/')));

server.use('/api/admin', permissions4, adminRouter);
server.use('/api/course', permissions1, courseRouter);
server.use('/api/play', permissions1, playRouter);
server.use('/api/me', permissions1, meRouter);

server.use(apiErrorHandler);

module.exports = server;
