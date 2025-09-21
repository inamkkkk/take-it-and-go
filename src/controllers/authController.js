const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const httpStatus = require('http-status-codes');
const { body, validationResult } = require('express-validator');

const signup = catchAsync(async (req, res) => {
  // TODO: Complete input validation for signup
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { user, token } = await authService.signup(req.body);
  res.status(httpStatus.CREATED).send({ user, token });
});

const login = catchAsync(async (req, res) => {
  // TODO: Complete input validation for login
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  res.status(httpStatus.OK).send({ user, token });
});

const resetPassword = catchAsync(async (req, res) => {
  // TODO: In a real app, 'newPassword' would not be sent directly.
  // A secure token-based flow would be used.
  // TODO: Add input validation for resetPassword
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { email, newPassword } = req.body;
  const result = await authService.resetPassword(email, newPassword);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  signup,
  login,
  resetPassword
};