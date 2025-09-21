const catchAsync = require('../utils/catchAsync');
const trackingService = require('../services/trackingService');
const httpStatus = require('http-status-codes');
const ApiError = require('../utils/ApiError'); // Assuming you have an ApiError class for custom errors

const startTracking = catchAsync(async (req, res) => {
  const { deliveryId } = req.body;
  // TODO: Add validation for deliveryId
  if (!deliveryId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Delivery ID is required');
  }
  // Assuming `req.user.id` is the traveler initiating tracking
  const updatedDelivery = await trackingService.startTracking(deliveryId, req.user.id);
  res.status(httpStatus.OK).send(updatedDelivery);
});

const stopTracking = catchAsync(async (req, res) => {
  const { deliveryId } = req.body;
  // TODO: Add validation for deliveryId
  if (!deliveryId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Delivery ID is required');
  }
  // Assuming `req.user.id` is the traveler stopping tracking
  const updatedDelivery = await trackingService.stopTracking(deliveryId, req.user.id);
  res.status(httpStatus.OK).send(updatedDelivery);
});

const getTracking = catchAsync(async (req, res) => {
  const { deliveryId } = req.params;
  // TODO: Add validation for deliveryId
  if (!deliveryId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Delivery ID is required');
  }
  // TODO: Add authorization check: only shipper, assigned traveler, or admin should see this.
  // This would involve fetching delivery details and checking req.user's role against the delivery's shipper/assigned traveler.
  // For now, we proceed with fetching logs.
  const logs = await trackingService.getTrackingLogs(deliveryId);
  res.status(httpStatus.OK).send(logs);
});

// For real-time GPS updates, a socket event would be used, this is a REST endpoint for historical data or initial log.
const logGPS = catchAsync(async (req, res) => {
  const { deliveryId, latitude, longitude } = req.body;
  // TODO: Add validation for deliveryId, latitude, and longitude
  if (!deliveryId || latitude === undefined || longitude === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Delivery ID, latitude, and longitude are required');
  }
  // Assuming `req.user.id` is the traveler logging GPS
  const gpsLog = await trackingService.logGPSCoordinate(deliveryId, req.user.id, latitude, longitude);
  res.status(httpStatus.CREATED).send(gpsLog);
});

module.exports = {
  startTracking,
  stopTracking,
  getTracking,
  logGPS
};