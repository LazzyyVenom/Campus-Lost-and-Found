const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const PasswordResetToken = require('../models/PasswordResetToken');
const { generateToken } = require('../utils/generateToken');

async function addLoginLog({ userId, emailAttempted, loginStatus, ipAddress, userAgent }) {
  await LoginLog.create({
    userId: userId || null,
    emailAttempted,
    loginStatus,
    ipAddress: ipAddress || '',
    userAgent: userAgent || '',
  });
}

function pickUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createMailerTransport() {
  const service = (process.env.SMTP_SERVICE || '').trim();
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (service) {
    if (!user || !pass) {
      throw new Error('SMTP is not configured. Set SMTP_USER and SMTP_PASS for the selected service.');
    }

    return nodemailer.createTransport({
      service,
      auth: {
        user,
        pass,
      },
    });
  }

  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user,
      pass,
    },
  });
}

async function sendResetOtpEmail({ email, name, otp }) {
  const mailer = createMailerTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await mailer.verify();

  await mailer.sendMail({
    from,
    to: email,
    subject: 'Campus Lost & Found - Password Reset OTP',
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#1a1a1a">
        <h2 style="margin:0 0 12px 0;color:#0A1F44">Password Reset Request</h2>
        <p>Hi ${name || 'User'},</p>
        <p>Your OTP for password reset is:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:3px;margin:16px 0;color:#0A1F44">${otp}</p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}

async function signup(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({
    email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: 'i' },
  });

  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      isAdmin: normalizedEmail === (process.env.ADMIN_EMAIL || '').toLowerCase(),
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      token: generateToken(user._id),
      user: pickUser(user),
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    throw error;
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';

  if (!normalizedEmail || !password) {
    await addLoginLog({
      emailAttempted: normalizedEmail || 'missing-email',
      loginStatus: 'FAILURE',
      ipAddress,
      userAgent,
    });

    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    await addLoginLog({
      emailAttempted: normalizedEmail,
      loginStatus: 'FAILURE',
      ipAddress,
      userAgent,
    });

    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    await addLoginLog({
      userId: user._id,
      emailAttempted: user.email,
      loginStatus: 'FAILURE',
      ipAddress,
      userAgent,
    });

    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  await addLoginLog({
    userId: user._id,
    emailAttempted: user.email,
    loginStatus: 'SUCCESS',
    ipAddress,
    userAgent,
  });

  return res.json({
    message: 'Logged in successfully.',
    token: generateToken(user._id),
    user: pickUser(user),
  });
}

async function me(req, res) {
  return res.json({ user: pickUser(req.user) });
}

async function forgotPassword(req, res) {
  const normalizedEmail = (req.body.email || '').trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const user = await User.findOne({ email: normalizedEmail });

  // Keep response generic to avoid exposing whether an email exists.
  if (!user) {
    return res.json({ message: 'If the email exists, an OTP has been sent.' });
  }

  const previousRequest = await PasswordResetToken.findOne({
    email: normalizedEmail,
    used: false,
  }).sort({ createdAt: -1 });

  if (previousRequest && Date.now() - previousRequest.createdAt.getTime() < 60 * 1000) {
    return res.status(429).json({ message: 'Please wait 1 minute before requesting another OTP.' });
  }

  const otp = String(crypto.randomInt(100000, 999999));
  const resetTokenHash = crypto.createHash('sha256').update(otp).digest('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await PasswordResetToken.updateMany(
    { email: normalizedEmail, used: false },
    { $set: { used: true } }
  );

  const tokenDoc = await PasswordResetToken.create({
    userId: user._id,
    email: user.email,
    resetTokenHash,
    expiresAt,
  });

  try {
    await sendResetOtpEmail({ email: user.email, name: user.name, otp });
    return res.json({ message: 'OTP sent to your email address.' });
  } catch (error) {
    console.error('Password reset email failed:', error.message);
    await PasswordResetToken.updateOne({ _id: tokenDoc._id }, { $set: { used: true } });
    if (/application-specific password|required|invalid login/i.test(error.message || '')) {
      return res.status(500).json({
        message: 'Gmail rejected the login. Use a Gmail app password in SMTP_PASS, not your normal password.',
      });
    }
    return res.status(500).json({ message: 'Could not send OTP email. Check SMTP settings and try again.' });
  }
}

async function resetPassword(req, res) {
  const { email, resetCode, password, confirmPassword } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!normalizedEmail || !resetCode || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const resetTokenHash = crypto.createHash('sha256').update(String(resetCode).trim()).digest('hex');

  const latestToken = await PasswordResetToken.findOne({
    email: normalizedEmail,
    resetTokenHash,
    used: false,
    expiresAt: { $gte: new Date() },
  }).sort({ createdAt: -1 });

  if (!latestToken) {
    return res.status(400).json({ message: 'Invalid or expired reset code.' });
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  await user.save();

  await PasswordResetToken.updateMany(
    { email: normalizedEmail, used: false },
    { $set: { used: true } }
  );

  return res.json({ message: 'Password reset successful. Please login again.' });
}

module.exports = {
  signup,
  login,
  me,
  forgotPassword,
  resetPassword,
};
