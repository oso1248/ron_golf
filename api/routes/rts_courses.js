const express = require('express');
const controller = require('../controllers/ctr_courses');
const router = express.Router();

// Courses
router.post('/course_view', controller.course_view);

// Holes
router.post('/hole_get_name', controller.hole_get_name);

module.exports = router;
