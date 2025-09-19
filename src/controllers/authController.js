const authService = require('../services/authService');
const logger = require('../utils/logger');

const signup = async (req, res, next) => {
  try {
    const { user, token } = await authService.signup(req.body);
    res.status(201).json({ success: true, user, token });
  } catch (error) {
    logger.error(`Auth Signup Error: ${error.message}`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ success: true, user, token });
  } catch (error) {
    logger.error(`Auth Login Error: ${error.message}`);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPassword(email, newPassword);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    logger.error(`Auth Reset Password Error: ${error.message}`);
    next(error);
  }
};

module.exports = { signup, login, resetPassword };