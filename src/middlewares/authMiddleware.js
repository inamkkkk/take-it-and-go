const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const User = require('../models/User');

// Custom type for req.user for better autocomplete (optional for JS)
/**
 * @typedef {Object} AuthenticatedRequest
 * @property {import('mongoose').Types.ObjectId} user.id
 * @property {string} user.role
 */

const authenticate = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', httpStatus.UNAUTHORIZED));
  }

  // 1) Verify token
  const decoded = jwt.verify(token, config.jwt.secret);

  // 2) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', httpStatus.UNAUTHORIZED));
  }

  // 3) Grant access to protected route
  req.user = { id: currentUser._id, role: currentUser.role }; // Attach user info to request
  next();
});

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // If no roles specified, allow all authenticated users
    if (roles.length === 0) return next();

    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', httpStatus.FORBIDDEN)
      );
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
