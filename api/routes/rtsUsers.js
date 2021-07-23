const express = require('express');
const db = require('../queries/qryUsers');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/', (req, res) => {
  const creds = req.body;
  creds.password = bcrypt.hashSync(creds.password, 6);
  db.addUser(creds)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).json({ msg: err.detail }));
});

module.exports = router;
