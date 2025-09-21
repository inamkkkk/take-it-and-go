const mongoose = require('mongoose');

const gpsLogSchema = new mongoose.Schema(
  {
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery',
      required: true
    },
    userId: {
      // The user whose location is being tracked (e.g., traveler)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Create a 2dsphere index for geospatial queries if needed
gpsLogSchema.index({ location: '2dsphere' });

const GPSLog = mongoose.model('GPSLog', gpsLogSchema);

module.exports = GPSLog;
