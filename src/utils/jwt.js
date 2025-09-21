const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate a JWT token.
 * @param {string} userId - The user ID.
 * @param {string} role - The user's role.
 * @returns {string} The JWT token.
 */
const generateToken = (userId, role) => {
  // TODO: Enhance token generation by potentially including more user details or refresh tokens.
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
  // TODO: Implement logic to handle token expiration and potentially refresh tokens.
  return jwt.verify(token, config.jwt.secret);
};

module.exports = {
  generateToken,
  verifyToken
};