const User = require('../models/User');
const AppError = require('../utils/appError');
const httpStatus = require('http-status-codes');

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  return user;
};

/**
 * Update user by ID
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  // TODO: Implement validation for updateBody fields.
  // For example, ensure 'email' is a valid email format if present.
  // Consider adding checks for other sensitive fields that shouldn't be directly updated.

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST);
  }

  // TODO: Prevent updates to immutable fields like 'id', 'createdAt', 'updatedAt'.
  // Ensure that only allowed fields from updateBody are applied to the user object.

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

module.exports = {
  getUserById,
  updateUserById
};