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
  // TODO: Extract token from headers, checking for 'Bearer' prefix.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // TODO: Return an error if no token is provided.
    return next(new AppError('You are not logged in! Please log in to get access.', httpStatus.UNAUTHORIZED));
  }

  // 1) Verify token
  // TODO: Verify the token using jwt.verify and the secret key.
  const decoded = jwt.verify(token, config.jwt.secret);

  // 2) Check if user still exists
  // TODO: Find the user in the database using the decoded user ID.
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    // TODO: Return an error if the user does not exist.
    return next(new AppError('The user belonging to this token no longer exists.', httpStatus.UNAUTHORIZED));
  }

  // 3) Grant access to protected route
  // TODO: Attach user information (id and role) to the request object.
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

    // TODO: Check if the authenticated user's role is included in the allowed roles.
    if (!req.user || !roles.includes(req.user.role)) {
      // TODO: Return a "Forbidden" error if the user's role is not authorized.
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