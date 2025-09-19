const trackingService = require('../services/trackingService');
const logger = require('../utils/logger');

const startTracking = async (req, res, next) => {
  try {
    const { deliveryId, lat, lng } = req.body;
    const userId = req.user.id;

    const result = await trackingService.startTracking(deliveryId, userId, lat, lng);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Tracking Controller Start Tracking Error: ${error.message}`);
    next(error);
  }
};

const stopTracking = async (req, res, next) => {
  try {
    const { deliveryId } = req.body;
    const userId = req.user.id;

    const result = await trackingService.stopTracking(deliveryId, userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Tracking Controller Stop Tracking Error: ${error.message}`);
    next(error);
  }
};

const getTracking = async (req, res, next) => {
  try {
    const { deliveryId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await trackingService.getTracking(deliveryId, userId, userRole);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Tracking Controller Get Tracking Error: ${error.message}`);
    next(error);
  }
};

module.exports = { startTracking, stopTracking, getTracking };