const Payment = require('../models/Payment');
const Delivery = require('../models/Delivery');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

const createEscrow = async (deliveryId, amount, userId, userRole) => {
  // TODO: Implement mock escrow creation logic.
  // This would typically involve interacting with a payment gateway to hold funds.
  // Rules:
  // 1. Only the shipper initiates escrow.
  // 2. Escrow can only be created for a 'pending' or 'matched' delivery.
  // 3. Payment status should be 'pending'.
  // 4. Mock service simulation: Generate a transaction ID and save it.

  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    throw new ApiError('Delivery not found', 404);
  }

  // For simplicity, assuming shipperId is verified by authMiddleware or passed explicitly
  if (delivery.shipperId.toString() !== userId) {
    throw new ApiError('Only the shipper can create escrow for this delivery', 403);
  }

  if (delivery.status === 'in-transit' || delivery.status === 'delivered' || delivery.status === 'cancelled') {
    throw new ApiError('Escrow cannot be created for a delivery in this state', 400);
  }

  // Check if escrow already exists for this delivery
  const existingPayment = await Payment.findOne({ deliveryId, status: 'pending' });
  if (existingPayment) {
    throw new ApiError('Escrow already exists and is pending for this delivery', 400);
  }

  const transactionId = `MOCK_ESCROW_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const payment = await Payment.create({
    deliveryId,
    amount,
    status: 'pending',
    transactionId,
  });

  logger.info(`Escrow created for delivery ${deliveryId} with amount ${amount}. Transaction ID: ${transactionId}`);

  return { payment, message: 'Mock escrow created successfully. Funds are pending.' };
};

const releaseFunds = async (deliveryId, userId, userRole) => {
  // TODO: Implement mock fund release logic.
  // This would typically be triggered upon successful delivery or by shipper confirmation.
  // Rules:
  // 1. Only the shipper can release funds.
  // 2. Funds can only be released if the payment is 'pending' and the delivery is 'delivered'.
  // 3. Update payment status to 'completed'.
  // 4. Mock service simulation: Log the release.

  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    throw new ApiError('Delivery not found', 404);
  }

  if (delivery.shipperId.toString() !== userId) {
    throw new ApiError('Only the shipper can release funds for this delivery', 403);
  }

  const payment = await Payment.findOne({ deliveryId, status: 'pending' });
  if (!payment) {
    throw new ApiError('No pending escrow found for this delivery', 404);
  }

  if (delivery.status !== 'delivered') {
    throw new ApiError('Funds can only be released for a delivered package. Current status: ' + delivery.status, 400);
  }

  payment.status = 'completed';
  await payment.save();

  logger.info(`Funds released for delivery ${deliveryId}. Payment ID: ${payment._id}.`);

  return { payment, message: 'Mock funds released successfully. Payment completed.' };
};

module.exports = { createEscrow, releaseFunds };