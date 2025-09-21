const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    shipperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Shipper ID is required.']
    },
    travelerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Traveler might be assigned later
    },
    pickup: {
      address: { type: String, required: [true, 'Pickup address is required.'] },
      coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    },
    drop: {
      address: { type: String, required: [true, 'Drop address is required.'] },
      coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    },
    itemDescription: {
      type: String,
      required: [true, 'Item description is required.']
    },
    itemWeight: {
      type: Number,
      min: [0, 'Item weight cannot be negative.'],
      default: 0
    },
    itemDimensions: {
      width: { type: Number, min: [0, 'Item width cannot be negative.'] },
      height: { type: Number, min: [0, 'Item height cannot be negative.'] },
      depth: { type: Number, min: [0, 'Item depth cannot be negative.'] }
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative.']
    },
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'matched',
          'in-transit',
          'delivered',
          'cancelled',
          'completed'
        ],
        message: '{VALUE} is not a valid status.'
      },
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

// TODO: Add any custom methods or static functions to the Delivery schema here.
// For example, you might want to add a method to update the delivery status
// or a static function to find deliveries within a certain radius.

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;