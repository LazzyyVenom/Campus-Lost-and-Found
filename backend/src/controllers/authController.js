const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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

  if (!user) {
    return res.status(404).json({ message: 'No user found with this email.' });
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

  await PasswordResetToken.create({
    userId: user._id,
    email: user.email,
    resetTokenHash,
    expiresAt,
  });

  return res.json({
    message: 'Reset code generated. (Demo mode: shown in response)',
    resetCode: otp,
  });
}

async function resetPassword(req, res) {
  const { email, resetCode, password, confirmPassword } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!resetCode || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Reset code and password fields are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const resetTokenHash = crypto.createHash('sha256').update(String(resetCode).trim()).digest('hex');

  const tokenFilter = {
    resetTokenHash,
    used: false,
    expiresAt: { $gte: new Date() },
  };

  if (normalizedEmail) {
    tokenFilter.email = normalizedEmail;
  }

  const latestToken = await PasswordResetToken.findOne(tokenFilter).sort({ createdAt: -1 });

  if (!latestToken) {
    return res.status(400).json({ message: 'Invalid or expired reset code.' });
  }

  const user = await User.findById(latestToken.userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  await user.save();

  await PasswordResetToken.updateMany(
    { userId: latestToken.userId, used: false },
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
