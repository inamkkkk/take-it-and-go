const mongoose = require('mongoose');

const GpsLogSchema = new mongoose.Schema({
  deliveryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Delivery',
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GpsLog', GpsLogSchema);