const db = require('../db');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  return next();
}

function requireGuest(req, res, next) {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  return next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.status(403).render('403', { title: 'Access Denied' });
  }

  const user = db
    .prepare('SELECT is_admin FROM users WHERE id = ?')
    .get(req.session.user.id);

  if (!user || user.is_admin !== 1) {
    return res.status(403).render('403', { title: 'Access Denied' });
  }

  return next();
}

module.exports = {
  requireAuth,
  requireGuest,
  requireAdmin,
};
