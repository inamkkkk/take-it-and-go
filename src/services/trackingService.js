const GpsLog = require('../models/GpsLog');
const Delivery = require('../models/Delivery');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

const startTracking = async (deliveryId, userId, lat, lng) => {
  // TODO: Implement logic to start tracking a delivery.
  // This typically involves associating a traveler with a delivery and recording their initial GPS location.
  // Rules:
  // 1. A delivery can only be tracked if it's in a 'matched' or 'in-transit' state.
  // 2. Only the assigned traveler (or possibly the shipper) can start tracking.
  // 3. Initial GPS log should be created.
  // 4. Update delivery status to 'in-transit'.

  const delivery = await Delivery.findById(deliveryId);

  if (!delivery) {
    throw new ApiError('Delivery not found', 404);
  }

  // Placeholder for real authentication/authorization logic
  // if (delivery.travelerId.toString() !== userId && delivery.shipperId.toString() !== userId) {
  //   throw new ApiError('Not authorized to start tracking this delivery', 403);
  // }

  if (delivery.status === 'delivered' || delivery.status === 'cancelled') {
    throw new ApiError('Cannot start tracking a completed or cancelled delivery', 400);
  }

  await GpsLog.create({ deliveryId, lat, lng });
  delivery.status = 'in-transit';
  await delivery.save();

  logger.info(`Tracking started for delivery ${deliveryId} by user ${userId} at [${lat}, ${lng}]`);

  return { message: 'Tracking started successfully', deliveryId, lat, lng };
};

const stopTracking = async (deliveryId, userId) => {
  // TODO: Implement logic to stop tracking a delivery.
  // This typically marks the end of the delivery journey.
  // Rules:
  // 1. Only the assigned traveler (or possibly the shipper) can stop tracking.
  // 2. Update delivery status to 'delivered' or 'completed'.
  // 3. This might trigger payment release in a real scenario.

  const delivery = await Delivery.findById(deliveryId);

  if (!delivery) {
    throw new ApiError('Delivery not found', 404);
  }

  // Placeholder for real authentication/authorization logic
  // if (delivery.travelerId.toString() !== userId) {
  //   throw new ApiError('Not authorized to stop tracking this delivery', 403);
  // }

  if (delivery.status !== 'in-transit') {
    throw new ApiError('Delivery is not currently in transit', 400);
  }

  delivery.status = 'delivered';
  await delivery.save();

  logger.info(`Tracking stopped for delivery ${deliveryId} by user ${userId}`);

  return { message: 'Tracking stopped and delivery marked as delivered', deliveryId };
};

const getTracking = async (deliveryId, userId, userRole) => {
  // TODO: Implement logic to retrieve the tracking history for a delivery.
  // Rules:
  // 1. Both shipper and traveler associated with the delivery should be able to view tracking.
  // 2. Fetch all GPS logs for the given deliveryId, sorted by timestamp.
  // 3. Optionally, integrate with Google Maps API to visualize the route (frontend concern).

  const delivery = await Delivery.findById(deliveryId);

  if (!delivery) {
    throw new ApiError('Delivery not found', 404);
  }

  // Placeholder for real authentication/authorization logic
  // if (delivery.shipperId.toString() !== userId && delivery.travelerId.toString() !== userId) {
  //   throw new ApiError('Not authorized to view tracking for this delivery', 403);
  // }

  const gpsLogs = await GpsLog.find({ deliveryId }).sort({ timestamp: 1 });

  logger.info(`Retrieved ${gpsLogs.length} GPS logs for delivery ${deliveryId}`);

  return { delivery, gpsLogs, message: 'Tracking data retrieved successfully.' };
};

module.exports = { startTracking, stopTracking, getTracking };