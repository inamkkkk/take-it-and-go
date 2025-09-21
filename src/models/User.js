const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status-codes');
const AppError = require('../utils/appError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      validate: {
        validator: function (v) {
          // Enhanced validation for phone numbers - allows common formats and international codes
          // This regex is a basic example and might need further refinement for specific international needs.
          return /^\+?(?:[0-9] ?){6,14}[0-9]$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false // Exclude password from query results by default
    },
    role: {
      type: String,
      enum: ['shipper', 'traveler'],
      default: 'shipper'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// TODO: Add validation for 'role' to ensure it's one of the allowed values if not handled by enum.
// The enum already handles this, so no additional validation is strictly necessary here.

// Hash password before saving
userSchema.pre('save', async function (next) {
  // If password is not modified, skip the hashing
  if (!this.isModified('password')) return next();

  try {
    // Hash the password with a salt round of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    // Pass any hashing errors to the error handling middleware
    return next(new AppError('Error hashing password', httpStatus.INTERNAL_SERVER_ERROR));
  }
});

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password - The candidate password to compare
 * @returns {Promise<boolean>} - True if the password matches, false otherwise
 */
userSchema.methods.correctPassword = async function (candidatePassword) {
  // Compare the candidate password with the stored hashed password
  return await bcrypt.compare(candidatePassword, this.password);
};

// TODO: Add a method to check if a phone number is taken, similar to isEmailTaken.
/**
 * Check if phone number is taken
 * @param {string} phone - The user's phone number
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};


const User = mongoose.model('User', userSchema);

module.exports = User;