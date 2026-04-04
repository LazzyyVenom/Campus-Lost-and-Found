const db = require('../db');

function sanitizeIp(rawIp) {
  if (!rawIp) {
    return null;
  }

  if (Array.isArray(rawIp)) {
    return rawIp[0];
  }

  return String(rawIp).split(',')[0].trim();
}

function addLoginLog({ userId, emailAttempted, loginStatus, ipAddress, userAgent }) {
  db.prepare(
    `INSERT INTO login_logs (
      user_id,
      email_attempted,
      login_status,
      ip_address,
      user_agent
    ) VALUES (?, ?, ?, ?, ?)`
  ).run(
    userId || null,
    emailAttempted,
    loginStatus,
    sanitizeIp(ipAddress),
    userAgent || null
  );
}

module.exports = {
  addLoginLog,
};
