const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/appError');
const httpStatus = require('http-status-codes');

/**
 * Create a new user (signup)
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
const signup = async (userData) => {
  if (await User.isEmailTaken(userData.email)) {
    throw new AppError('Email already registered', httpStatus.BAD_REQUEST);
  }
  if (await User.findOne({ phone: userData.phone })) {
    throw new AppError('Phone number already registered', httpStatus.BAD_REQUEST);
  }

  const user = await User.create(userData);
  const token = generateToken(user._id, user.role);
  return { user: user.toObject(), token };
};

/**
 * Log in a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password))) {
    throw new AppError('Incorrect email or password', httpStatus.UNAUTHORIZED);
  }

  const token = generateToken(user._id, user.role);
  return { user: user.toObject(), token };
};

/**
 * Reset user password (stub)
 * @param {string} email
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (email, newPassword) => {
  // TODO: Implement actual password reset logic.
  // This would typically involve:
  // 1. Generating a password reset token.
  // 2. Sending the token to the user's email.
  // 3. User clicks on link with token to set new password.
  // For this skeleton, we'll just mock a direct reset for now.

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User with that email not found', httpStatus.NOT_FOUND);
  }

  // In a real scenario, this would be a secure, token-based process.
  // For the skeleton, we'll directly update the password (NOT FOR PRODUCTION).
  user.password = newPassword; // User model's pre-save hook will hash it.
  await user.save();

  // Return user data (without password) or a success message
  return { message: 'Password reset successfully (DEVELOPMENT STUB)' };
};

module.exports = {
  signup,
  login,
  resetPassword
};
