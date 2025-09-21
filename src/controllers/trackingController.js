const catchAsync = require('../utils/catchAsync');
const trackingService = require('../services/trackingService');
const httpStatus = require('http-status-codes');

const startTracking = catchAsync(async (req, res) => {
  const { deliveryId } = req.body;
  // Assuming `req.user.id` is the traveler initiating tracking
  const updatedDelivery = await trackingService.startTracking(deliveryId, req.user.id);
  res.status(httpStatus.OK).send(updatedDelivery);
});

const stopTracking = catchAsync(async (req, res) => {
  const { deliveryId } = req.body;
  // Assuming `req.user.id` is the traveler stopping tracking
  const updatedDelivery = await trackingService.stopTracking(deliveryId, req.user.id);
  res.status(httpStatus.OK).send(updatedDelivery);
});

const getTracking = catchAsync(async (req, res) => {
  const { deliveryId } = req.params;
  // TODO: Add authorization check: only shipper, assigned traveler, or admin should see this.
  const logs = await trackingService.getTrackingLogs(deliveryId);
  res.status(httpStatus.OK).send(logs);
});

// For real-time GPS updates, a socket event would be used, this is a REST endpoint for historical data or initial log.
const logGPS = catchAsync(async (req, res) => {
  const { deliveryId, latitude, longitude } = req.body;
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
