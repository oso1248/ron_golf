const express = require('express');
const controller = require('../controllers/ctr_play');
const router = express.Router();

// Courses
router.post('/round_add', controller.round_add);

// Tournaments
router.post('/tournament_list', controller.tournament_list);
router.post('/tournament_sign_up', controller.tournament_sign_up);
router.post('/tournament_get_name', controller.tournament_get_name);

module.exports = router;
