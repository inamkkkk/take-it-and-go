const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  deliveryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Delivery',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Chat', ChatSchema);