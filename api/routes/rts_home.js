const express = require('express');
const controller = require('../controllers/ctr_home');
const router = express.Router();

// Weather
router.post('/course_next_weather', controller.course_next_weather);

module.exports = router;
