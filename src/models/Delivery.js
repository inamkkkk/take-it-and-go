const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    shipperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    travelerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Traveler might be assigned later
    },
    pickup: {
      address: { type: String, required: true },
      coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    },
    drop: {
      address: { type: String, required: true },
      coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    },
    itemDescription: {
      type: String,
      required: true
    },
    itemWeight: {
      type: Number,
      min: 0,
      default: 0
    },
    itemDimensions: {
      width: Number,
      height: Number,
      depth: Number
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: [
        'pending',
        'matched',
        'in-transit',
        'delivered',
        'cancelled',
        'completed'
      ],
      default: 'pending'
    },
    requestedPickupTime: Date,
    expectedDeliveryTime: Date,
    actualDeliveryTime: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
