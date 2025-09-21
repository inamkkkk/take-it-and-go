const GPSLog = require('../models/GPSLog');
const Delivery = require('../models/Delivery');
const httpStatus = require('http-status-codes');
const AppError = require('../utils/appError');

// In a real application, tracking would involve websockets or a dedicated real-time service.
// These functions are simplified for skeleton purposes.

/**
 * Start tracking for a delivery.
 * Marks a delivery as 'in-transit'.
 * @param {string} deliveryId
 * @param {string} travelerId
 * @returns {Promise<Delivery>}
 */
const startTracking = async (deliveryId, travelerId) => {
  const delivery = await Delivery.findById(deliveryId);

  if (!delivery) {
    throw new AppError('Delivery not found', httpStatus.NOT_FOUND);
  }
  if (delivery.travelerId && delivery.travelerId.toString() !== travelerId) {
    throw new AppError('You are not authorized to track this delivery.', httpStatus.FORBIDDEN);
  }
  if (!delivery.travelerId) {
    delivery.travelerId = travelerId; // Assign traveler if not already assigned
  }

  delivery.status = 'in-transit';
  await delivery.save();

  // TODO: Potentially emit a socket event here to notify interested parties (shipper, other travelers).

  return delivery;
};

/**
 * Stop tracking for a delivery.
 * Marks a delivery as 'delivered' or 'completed'.
 * @param {string} deliveryId
 * @param {string} travelerId
 * @returns {Promise<Delivery>}
 */
const stopTracking = async (deliveryId, travelerId) => {
  const delivery = await Delivery.findById(deliveryId);

  if (!delivery) {
    throw new AppError('Delivery not found', httpStatus.NOT_FOUND);
  }
  if (!delivery.travelerId || delivery.travelerId.toString() !== travelerId) {
    throw new AppError('You are not authorized to stop tracking for this delivery.', httpStatus.FORBIDDEN);
  }

  delivery.status = 'delivered'; // Or 'completed' depending on final workflow step
  delivery.actualDeliveryTime = new Date();
  await delivery.save();

  // TODO: Emit socket event for delivery completion.

  return delivery;
};

/**
 * Log a GPS coordinate for a delivery.
 * @param {string} deliveryId
 * @param {string} userId - The user sending the log (e.g., traveler)
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<GPSLog>}
 */
const logGPSCoordinate = async (deliveryId, userId, latitude, longitude) => {
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    throw new AppError('Delivery not found', httpStatus.NOT_FOUND);
  }
  if (!delivery.travelerId || delivery.travelerId.toString() !== userId) {
    throw new AppError('Only the assigned traveler can log GPS for this delivery.', httpStatus.FORBIDDEN);
  }
  if (delivery.status !== 'in-transit') {
    throw new AppError('Delivery is not currently in transit.', httpStatus.BAD_REQUEST);
  }

  const gpsLog = await GPSLog.create({
    deliveryId,
    userId,
    latitude,
    longitude
  });

  // TODO: Emit socket event for real-time location update.

  return gpsLog;
};

/**
 * Get all tracking logs for a specific delivery.
 * @param {string} deliveryId
 * @returns {Promise<Array<GPSLog>>}
 */
const getTrackingLogs = async (deliveryId) => {
  // TODO: Add authorization check: only shipper, assigned traveler, or admin should see this.
  const logs = await GPSLog.find({ deliveryId }).sort({ timestamp: 1 });
  return logs;
};

module.exports = {
  startTracking,
  stopTracking,
  logGPSCoordinate,
  getTrackingLogs
};
