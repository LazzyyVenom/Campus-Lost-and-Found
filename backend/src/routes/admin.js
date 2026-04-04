const express = require('express');

const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/admin/login-logs', requireAuth, requireAdmin, (req, res) => {
  const logs = db
    .prepare(
      `SELECT
        login_logs.id,
        login_logs.email_attempted,
        login_logs.login_status,
        login_logs.ip_address,
        login_logs.user_agent,
        login_logs.attempted_at,
        users.name AS user_name
      FROM login_logs
      LEFT JOIN users ON users.id = login_logs.user_id
      ORDER BY login_logs.attempted_at DESC
      LIMIT 150`
    )
    .all();

  const stats = db
    .prepare(
      `SELECT
        COUNT(*) AS total_attempts,
        SUM(CASE WHEN login_status = 'SUCCESS' THEN 1 ELSE 0 END) AS total_success,
        SUM(CASE WHEN login_status = 'FAILURE' THEN 1 ELSE 0 END) AS total_failure
      FROM login_logs`
    )
    .get();

  res.render('admin-login-logs', {
    title: 'Login Audit',
    logs,
    stats,
  });
});

module.exports = router;
