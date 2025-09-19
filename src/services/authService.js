const User = require('../models/User');
const { comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/apiError');

const signup = async (userData) => {
  const { email, phone, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError('User with this email already exists', 400);
    }
    if (existingUser.phone === phone) {
      throw new ApiError('User with this phone number already exists', 400);
    }
  }

  const user = await User.create({ email, phone, password, role });

  const token = generateToken({ id: user._id, role: user.role });
  return { user: { id: user._id, email: user.email, role: user.role }, token };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password'); // Select password explicitly

  if (!user) {
    throw new ApiError('Invalid credentials', 401);
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new ApiError('Invalid credentials', 401);
  }

  const token = generateToken({ id: user._id, role: user.role });
  return { user: { id: user._id, email: user.email, role: user.role }, token };
};

const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  user.password = newPassword; // Mongoose pre-save hook will hash it
  await user.save();

  return { message: 'Password reset successfully' };
};

module.exports = { signup, login, resetPassword };