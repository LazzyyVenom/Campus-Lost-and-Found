const express = require('express');
const { getLoginLogs, getAllUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/login-logs', protect, adminOnly, getLoginLogs);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
