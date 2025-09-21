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
// Note: The current schema doesn't have a 'location' field.
// If you intend to perform geospatial queries, you might want to add a 'location' field
// that combines latitude and longitude, or index the existing fields appropriately.
// For example, to index lat/lng directly:
gpsLogSchema.index({ latitude: 1, longitude: 1 });
// If you wanted to use a GeoJSON point for geospatial queries:
/*
gpsLogSchema.add({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});
gpsLogSchema.index({ location: '2dsphere' });
*/

const GPSLog = mongoose.model('GPSLog', gpsLogSchema);

module.exports = GPSLog;