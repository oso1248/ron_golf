const express = require('express');
const controller = require('../controllers/ctr_admin');
const router = express.Router();

// Users
router.post('/user_view', controller.user_view);
router.post('/user_add', controller.user_add);
router.post('/user_get_username', controller.user_get_username);
router.post('/user_get_email', controller.user_get_email);
router.post('/user_get_name', controller.user_get_name);
router.post('/user_update_name', controller.user_update_name);
router.post('/user_delete_name', controller.user_delete_name);

// Courses
router.post('/course_view', controller.course_view);
router.post('/course_add', controller.course_add);
router.post('/course_get_email', controller.course_get_email);
router.post('/course_get_name', controller.course_get_name);
router.post('/course_update_name', controller.course_update_name);
router.post('/course_delete_name', controller.course_delete_name);

// Holes
router.post('/hole_get_name', controller.hole_get_name);
router.post('/hole_update_name', controller.hole_update_name);

module.exports = router;
