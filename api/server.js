const express = require('express');
const path = require('path');
const cookie = require('./cookies');

const server = express();

const permissions1 = require('./auth/perm1');
const permissions2 = require('./auth/perm2');
const permissions3 = require('./auth/perm3');
const permissions4 = require('./auth/perm4');
const permissions5 = require('./auth/perm5');

const loginRouter = require('./auth/login');
const adminRouter = require('./routes/rts_admin');

server.use(express.json());
server.use(cookie.sessionConfig);

server.use(express.static(path.join(__dirname, '../pages/site/login/')));
server.use('/api/auth', loginRouter);
server.use('/', permissions1);
server.use(express.static(path.join(__dirname, '../pages/site/')));

server.use('/api/admin', adminRouter);

module.exports = server;
