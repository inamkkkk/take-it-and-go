const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate a JWT token.
 * @param {string} userId - The user ID.
 * @param {string} role - The user's role.
 * @returns {string} The JWT token.
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

/**
 * Verify a JWT token.
 * @param {string} token - The JWT token.
 * @returns {Object} The decoded token payload.
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

module.exports = {
  generateToken,
  verifyToken
};
