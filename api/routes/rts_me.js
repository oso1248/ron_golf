const express = require('express');
const controller = require('../controllers/ctr_me');
const router = express.Router();

// Courses
router.post('/playing_list', controller.playing_list);

// Tournaments
router.post('/played_list', controller.played_list);

// Details
router.post('/details_round_list', controller.details_round_list);
router.post('/details_round_id', controller.details_round_id);
router.post('/details_tournament_id', controller.details_tournament_id);

module.exports = router;
