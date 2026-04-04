const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const db = require('../db');
const { requireGuest } = require('../middleware/auth');
const { addLoginLog } = require('../services/loginLogService');
const { setFlash } = require('../utils/flash');

const router = express.Router();

router.get('/signup', requireGuest, (req, res) => {
  res.render('signup', { title: 'Create Account' });
});

router.post('/signup', requireGuest, async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    setFlash(req, 'error', 'All fields are required.');
    return res.redirect('/signup');
  }

  if (password.length < 6) {
    setFlash(req, 'error', 'Password must be at least 6 characters long.');
    return res.redirect('/signup');
  }

  if (password !== confirmPassword) {
    setFlash(req, 'error', 'Passwords do not match.');
    return res.redirect('/signup');
  }

  const existingUser = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email.trim().toLowerCase());

  if (existingUser) {
    setFlash(req, 'error', 'Email is already registered.');
    return res.redirect('/signup');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name.trim(), email.trim().toLowerCase(), passwordHash);

  req.session.user = {
    id: result.lastInsertRowid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    isAdmin: false,
  };

  setFlash(req, 'success', 'Welcome! Your account has been created.');
  return res.redirect('/dashboard');
});

router.get('/login', requireGuest, (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/forgot-password', requireGuest, (req, res) => {
  res.render('forgot-password', { title: 'Forgot Password' });
});

router.post('/forgot-password', requireGuest, (req, res) => {
  const normalizedEmail = req.body.email ? req.body.email.trim().toLowerCase() : '';

  if (!normalizedEmail) {
    setFlash(req, 'error', 'Please enter your registered email address.');
    return res.redirect('/forgot-password');
  }

  const user = db
    .prepare('SELECT id, email FROM users WHERE email = ?')
    .get(normalizedEmail);

  if (!user) {
    setFlash(req, 'error', 'No account found with that email.');
    return res.redirect('/forgot-password');
  }

  const resetToken = String(crypto.randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  db.prepare(
    `INSERT INTO password_reset_tokens (
      user_id,
      email,
      reset_token,
      expires_at
    ) VALUES (?, ?, ?, ?)`
  ).run(user.id, user.email, resetToken, expiresAt);

  setFlash(
    req,
    'success',
    `Password reset code (demo): ${resetToken}. It is valid for 15 minutes.`
  );
  return res.redirect(`/reset-password?email=${encodeURIComponent(user.email)}`);
});

router.get('/reset-password', requireGuest, (req, res) => {
  const email = req.query.email || '';
  res.render('reset-password', { title: 'Reset Password', email });
});

router.post('/reset-password', requireGuest, async (req, res) => {
  const {
    email,
    resetToken,
    password,
    confirmPassword,
  } = req.body;

  const normalizedEmail = email ? email.trim().toLowerCase() : '';

  if (!normalizedEmail || !resetToken || !password || !confirmPassword) {
    setFlash(req, 'error', 'All fields are required.');
    return res.redirect(`/reset-password?email=${encodeURIComponent(normalizedEmail)}`);
  }

  if (password.length < 6) {
    setFlash(req, 'error', 'Password must be at least 6 characters long.');
    return res.redirect(`/reset-password?email=${encodeURIComponent(normalizedEmail)}`);
  }

  if (password !== confirmPassword) {
    setFlash(req, 'error', 'Passwords do not match.');
    return res.redirect(`/reset-password?email=${encodeURIComponent(normalizedEmail)}`);
  }

  const resetRow = db
    .prepare(
      `SELECT *
       FROM password_reset_tokens
       WHERE email = ?
         AND reset_token = ?
         AND used = 0
         AND expires_at >= CURRENT_TIMESTAMP
       ORDER BY id DESC
       LIMIT 1`
    )
    .get(normalizedEmail, resetToken.trim());

  if (!resetRow) {
    setFlash(req, 'error', 'Invalid or expired reset code.');
    return res.redirect(`/reset-password?email=${encodeURIComponent(normalizedEmail)}`);
  }

  const user = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(normalizedEmail);

  if (!user) {
    setFlash(req, 'error', 'User not found.');
    return res.redirect('/forgot-password');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
    .run(passwordHash, user.id);

  db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE email = ?')
    .run(normalizedEmail);

  setFlash(req, 'success', 'Password reset successful. Please login with your new password.');
  return res.redirect('/login');
});

router.post('/login', requireGuest, async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email ? email.trim().toLowerCase() : '';
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  const userAgent = req.headers['user-agent'] || null;

  if (!email || !password) {
    addLoginLog({
      userId: null,
      emailAttempted: normalizedEmail || 'missing-email',
      loginStatus: 'FAILURE',
      ipAddress,
      userAgent,
    });
    setFlash(req, 'error', 'Email and password are required.');
    return res.redirect('/login');
  }

  const user = db
    .prepare('SELECT id, name, email, password_hash, is_admin FROM users WHERE email = ?')
    .get(normalizedEmail);

  if (!user) {
    addLoginLog({
      userId: null,
      emailAttempted: normalizedEmail,
      loginStatus: 'FAILURE',
      ipAddress,
      userAgent,
    });
    setFlash(req, 'error', 'Invalid email or password.');
    return res.redirect('/login');
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    addLoginLog({
      userId: user.id,
      emailAttempted: user.email,
      loginStatus: 'FAILURE',
      ipAddress,
      userAgent,
    });
    setFlash(req, 'error', 'Invalid email or password.');
    return res.redirect('/login');
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.is_admin === 1,
  };

  addLoginLog({
    userId: user.id,
    emailAttempted: user.email,
    loginStatus: 'SUCCESS',
    ipAddress,
    userAgent,
  });

  setFlash(req, 'success', 'Logged in successfully.');
  return res.redirect('/dashboard');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
