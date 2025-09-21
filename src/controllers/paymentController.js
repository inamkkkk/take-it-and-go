const catchAsync = require('../utils/catchAsync');
const paymentService = require('../services/paymentService');
const httpStatus = require('http-status-codes');

const createEscrow = catchAsync(async (req, res) => {
  const { deliveryId, amount } = req.body;
  // `req.user.id` would come from JWT authentication middleware
  const payment = await paymentService.createEscrow(deliveryId, amount, req.user.id);
  res.status(httpStatus.CREATED).send(payment);
});

const releaseFunds = catchAsync(async (req, res) => {
  const { paymentId } = req.body;
  // `req.user.id` would come from JWT authentication middleware
  const payment = await paymentService.releaseFunds(paymentId, req.user.id);
  res.status(httpStatus.OK).send(payment);
});

module.exports = {
  createEscrow,
  releaseFunds
};
