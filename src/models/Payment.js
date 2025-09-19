const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  deliveryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Delivery',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'refunded', 'failed'],
    default: 'pending',
  },
  transactionId: {
    type: String, // From mock payment service
    unique: true,
    sparse: true, // Allow null values for unique field
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', PaymentSchema);