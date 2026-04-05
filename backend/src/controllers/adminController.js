const LoginLog = require('../models/LoginLog');
const User = require('../models/User');

async function getLoginLogs(req, res) {
  const logs = await LoginLog.find({})
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(200);

  const [totalAttempts, totalSuccess, totalFailure, totalUsers] = await Promise.all([
    LoginLog.countDocuments(),
    LoginLog.countDocuments({ loginStatus: 'SUCCESS' }),
    LoginLog.countDocuments({ loginStatus: 'FAILURE' }),
    User.countDocuments(),
  ]);

  return res.json({
    stats: {
      totalAttempts,
      totalSuccess,
      totalFailure,
      totalUsers,
    },
    logs,
  });
}

async function getAllUsers(req, res) {
  const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
  return res.json({ users });
}

module.exports = {
  getLoginLogs,
  getAllUsers,
};
