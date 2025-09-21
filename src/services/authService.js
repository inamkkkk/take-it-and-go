const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/appError');
const httpStatus = require('http-status-codes');
const crypto = require('crypto');
const sendEmail = require('../utils/email'); // Assuming you have an email utility

/**
 * Create a new user (signup)
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
const signup = async (userData) => {
  // TODO: Enhance input validation for signup. Ensure required fields are present and in correct format.
  // For example, check if userData.email, userData.password, userData.name are provided and valid.
  if (!userData.name || !userData.email || !userData.password || !userData.phone) {
    throw new AppError('Missing required user data', httpStatus.BAD_REQUEST);
  }

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
  // TODO: Add input validation for login. Ensure email and password are provided.
  if (!email || !password) {
    throw new AppError('Email and password are required', httpStatus.BAD_REQUEST);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password))) {
    throw new AppError('Incorrect email or password', httpStatus.UNAUTHORIZED);
  }

  const token = generateToken(user._id, user.role);
  return { user: user.toObject(), token };
};

/**
 * Request password reset
 * @param {string} email
 * @returns {Promise<void>}
 */
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // In a real application, you wouldn't want to expose that the email doesn't exist.
    // Just return a generic success message to prevent enumeration.
    // For development/skeleton purposes, we can log or throw specific error if needed.
    throw new AppError('User with that email not found', httpStatus.NOT_FOUND);
  }

  // Generate a random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false }); // Disable validation for this specific save

  const resetUrl = `${process.env.APP_URL}/resetPassword/${resetToken}`; // Construct reset URL

  // TODO: Implement actual email sending.
  // This part assumes a `sendEmail` utility is available.
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `Hello ${user.name},\n\nWe received a request to reset your password. Please click on the following link to reset your password: ${resetUrl}\n\nIf you did not request this, please ignore this email.\n`,
      html: `
        <h1>Password Reset Request</h1>
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password. Please click on the following link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `
    });
    return { message: 'Password reset email sent successfully.' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    // Reset token and expiry if email sending fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('Error sending password reset email. Please try again later.', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Reset user password using the reset token
 * @param {string} resetToken
 * @param {string} newPassword
 * @returns {Promise<Object>}
 */
const resetPassword = async (resetToken, newPassword) => {
  // 1. Hash the token
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // 2. Find user by token and check if expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', httpStatus.BAD_REQUEST);
  }

  // 3. Update password
  user.password = newPassword; // Mongoose pre-save hook will hash the password
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4. Log the user in by generating a new token
  const token = generateToken(user._id, user.role);
  return { user: user.toObject(), token, message: 'Password reset successfully.' };
};

module.exports = {
  signup,
  login,
  requestPasswordReset,
  resetPassword
};