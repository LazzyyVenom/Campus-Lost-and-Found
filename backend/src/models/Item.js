const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ['LOST', 'FOUND'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['LOST', 'FOUND', 'RETURNED'],
      required: true,
    },
    incidentDate: {
      type: Date,
      required: true,
    },
    locationLost: {
      type: String,
      default: '',
      trim: true,
    },
    locationFound: {
      type: String,
      default: '',
      trim: true,
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
    imageData: {
      type: String,
      default: '',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Item', itemSchema);
