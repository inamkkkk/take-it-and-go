const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const httpStatus = require('http-status-codes');

const signup = catchAsync(async (req, res) => {
  const { user, token } = await authService.signup(req.body);
  res.status(httpStatus.CREATED).send({ user, token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  res.status(httpStatus.OK).send({ user, token });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword } = req.body;
  // TODO: In a real app, 'newPassword' would not be sent directly.
  // A secure token-based flow would be used.
  const result = await authService.resetPassword(email, newPassword);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  signup,
  login,
  resetPassword
};
