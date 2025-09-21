const catchAsync = require('../utils/catchAsync');
const paymentService = require('../services/paymentService');
const httpStatus = require('http-status-codes');
const ApiError = require('../utils/ApiError'); // Assuming ApiError is available for structured errors

const createEscrow = catchAsync(async (req, res) => {
  const { deliveryId, amount } = req.body;

  // TODO: Implement input validation for deliveryId and amount.
  // Ensure deliveryId is a valid ID format and amount is a positive number.
  if (!deliveryId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Delivery ID is required');
  }
  if (amount === undefined || amount === null || amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Amount must be a positive number');
  }

  // `req.user.id` would come from JWT authentication middleware
  const payment = await paymentService.createEscrow(deliveryId, amount, req.user.id);
  res.status(httpStatus.CREATED).send(payment);
});

const releaseFunds = catchAsync(async (req, res) => {
  const { paymentId } = req.body;

  // TODO: Implement input validation for paymentId.
  // Ensure paymentId is a valid ID format.
  if (!paymentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment ID is required');
  }

  // `req.user.id` would come from JWT authentication middleware
  const payment = await paymentService.releaseFunds(paymentId, req.user.id);
  res.status(httpStatus.OK).send(payment);
});

module.exports = {
  createEscrow,
  releaseFunds
};