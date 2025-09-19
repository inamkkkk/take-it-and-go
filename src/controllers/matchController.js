const matchService = require('../services/matchService');
const logger = require('../utils/logger');

const findMatches = async (req, res, next) => {
  try {
    const { deliveryId } = req.body;
    const userId = req.user.id; // From authMiddleware
    const userRole = req.user.role; // From authMiddleware

    const result = await matchService.findMatches(deliveryId, userId, userRole);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Match Controller Find Matches Error: ${error.message}`);
    next(error);
  }
};

module.exports = { findMatches };