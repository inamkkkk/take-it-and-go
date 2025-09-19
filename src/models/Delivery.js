const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  shipperId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  travelerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null,
  },
  pickup: {
    type: Object,
    required: true, // { address: String, lat: Number, lng: Number }
  },
  drop: {
    type: Object,
    required: true, // { address: String, lat: Number, lng: Number }
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Additional fields for delivery details, e.g., item description, weight, dimensions, price
  itemDescription: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model('Delivery', DeliverySchema);