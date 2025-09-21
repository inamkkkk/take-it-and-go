const bcrypt = require('bcryptjs');

/**
 * Hash a password.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password.
 * @param {string} candidatePassword - The plain text password to compare.
 * @param {string} hashedPassword - The stored hashed password.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
