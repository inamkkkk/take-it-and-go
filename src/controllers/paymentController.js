const paymentService = require('../services/paymentService');
const logger = require('../utils/logger');

const createEscrow = async (req, res, next) => {
  try {
    const { deliveryId, amount } = req.body;
    const userId = req.user.id; // From authMiddleware
    const userRole = req.user.role; // From authMiddleware

    const result = await paymentService.createEscrow(deliveryId, amount, userId, userRole);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Payment Controller Create Escrow Error: ${error.message}`);
    next(error);
  }
};

const releaseFunds = async (req, res, next) => {
  try {
    const { deliveryId } = req.body;
    const userId = req.user.id; // From authMiddleware
    const userRole = req.user.role; // From authMiddleware

    const result = await paymentService.releaseFunds(deliveryId, userId, userRole);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Payment Controller Release Funds Error: ${error.message}`);
    next(error);
  }
};

module.exports = { createEscrow, releaseFunds };