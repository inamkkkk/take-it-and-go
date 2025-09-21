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

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST);
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

module.exports = {
  getUserById,
  updateUserById
};
