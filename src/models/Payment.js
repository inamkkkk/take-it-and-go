const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery',
      required: [true, 'Delivery ID is required for payment.']
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required.'],
      min: [0, 'Payment amount cannot be negative.']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'failed', 'refunded'],
        message: '{VALUE} is not a valid payment status.'
      },
      default: 'pending'
    },
    transactionRef: {
      // This could store an external payment gateway transaction ID
      type: String,
      unique: true,
      sparse: true // Allows null values to not violate unique constraint
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// TODO: Add pre-save hooks for validation or other logic if needed.
// For example, you might want to ensure a transactionRef is only set for certain statuses,
// or to perform some checks before saving.

paymentSchema.pre('save', function(next) {
  // Example: Ensure transactionRef is not set if status is 'pending' unless it's an update
  if (this.isModified('transactionRef') && this.status === 'pending' && !this.isNew) {
    const err = new Error('Transaction reference cannot be modified once payment is pending.');
    err.name = 'ValidationError';
    return next(err);
  }
  next();
});


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;