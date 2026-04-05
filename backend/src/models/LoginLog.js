const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    emailAttempted: {
      type: String,
      required: true,
      trim: true,
    },
    loginStatus: {
      type: String,
      enum: ['SUCCESS', 'FAILURE'],
      required: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LoginLog', loginLogSchema);
