const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required']
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required']
    },
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery',
      required: false // Chat can be general or delivery-specific
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      minlength: [1, 'Message cannot be empty']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Add an index for senderId and receiverId to improve query performance
chatSchema.index({ senderId: 1, receiverId: 1 });
chatSchema.index({ receiverId: 1, senderId: 1 }); // Index for the reverse order as well

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;