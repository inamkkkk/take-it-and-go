/**
 * Wrapper for async route handlers to catch errors and pass them to Express error middleware.
 * @param {Function} fn - Async Express route handler function (req, res, next).
 * @returns {Function} Express middleware function.
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;