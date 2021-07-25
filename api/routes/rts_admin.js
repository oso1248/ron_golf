const express = require('express');
const adminController = require('../controllers/ctr_admin');
const router = express.Router();

// Users
router.post('/user_view', adminController.user_view);
router.post('/user_add', adminController.user_add);
router.post('/user_get_username', adminController.user_get_username);
router.post('/user_get_email', adminController.user_get_email);
router.post('/user_get_name', adminController.user_get_name);
router.post('/user_update_name', adminController.user_update_name);
router.post('/user_delete_name', adminController.user_delete_name);

module.exports = router;
