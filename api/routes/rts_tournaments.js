const express = require('express');
const controller = require('../controllers/ctr_tournaments');
const router = express.Router();

// Tournaments
router.post('/tournament_list', controller.tournament_list);
router.post('/tournament_get_id', controller.tournament_get_id);
router.post('/tournament_played_get_id', controller.tournament_played_get_id);
router.post('/tournament_details_get_id', controller.tournament_details_get_id);

module.exports = router;
