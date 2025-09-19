const logger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl} - IP: ${req.ip}`);
  next();
};

module.exports = loggerMiddleware;