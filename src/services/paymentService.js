const Payment = require('../models/Payment');
const Delivery = require('../models/Delivery');
const AppError = require('../utils/appError');
const httpStatus = require('http-status-codes');

/**
 * Create an escrow payment for a delivery.
 * This simulates a payment being held in escrow.
 * @param {string} deliveryId
 * @param {number} amount
 * @param {string} userId - The user initiating the payment (shipper)
 * @returns {Promise<Payment>}
 */
const createEscrow = async (deliveryId, amount, userId) => {
  const delivery = await Delivery.findById(deliveryId);

  if (!delivery) {
    throw new AppError('Delivery not found', httpStatus.NOT_FOUND);
  }
  if (delivery.shipperId.toString() !== userId) {
    throw new AppError('Only the shipper can create escrow for this delivery.', httpStatus.FORBIDDEN);
  }
  if (delivery.status !== 'matched' && delivery.status !== 'pending') {
    throw new AppError('Payment can only be initiated for pending or matched deliveries.', httpStatus.BAD_REQUEST);
  }
  if (delivery.price !== amount) {
    throw new AppError('Payment amount must match delivery price.', httpStatus.BAD_REQUEST);
  }

  // Check if an escrow payment already exists for this delivery
  const existingPayment = await Payment.findOne({ deliveryId, status: 'pending' });
  if (existingPayment) {
    throw new AppError('A pending escrow payment already exists for this delivery.', httpStatus.BAD_REQUEST);
  }

  const payment = await Payment.create({
    deliveryId,
    amount,
    status: 'pending' // Simulates funds held in escrow
    // In a real system, you'd integrate with a payment gateway here
    // and store a transaction reference.
  });

  // Update delivery status if necessary, e.g., 'payment-pending' or directly 'in-transit' if this is the final step
  // For now, we'll assume it transitions later.

  return payment;
};

/**
 * Release funds from escrow to the traveler.
 * This simulates completing the payment to the traveler after delivery.
 * @param {string} paymentId
 * @param {string} userId - The user authorizing the release (shipper or system)
 * @returns {Promise<Payment>}
 */
const releaseFunds = async (paymentId, userId) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new AppError('Payment not found', httpStatus.NOT_FOUND);
  }
  if (payment.status !== 'pending') {
    throw new AppError('Funds can only be released from pending payments.', httpStatus.BAD_REQUEST);
  }

  const delivery = await Delivery.findById(payment.deliveryId);
  if (!delivery) {
    throw new AppError('Associated delivery not found', httpStatus.NOT_FOUND);
  }
  if (delivery.shipperId.toString() !== userId) {
    throw new AppError('Only the shipper can release funds for this delivery.', httpStatus.FORBIDDEN);
  }
  if (delivery.status !== 'delivered' && delivery.status !== 'completed') {
    throw new AppError('Funds can only be released after the delivery is marked as delivered/completed.', httpStatus.BAD_REQUEST);
  }

  payment.status = 'completed';
  await payment.save();

  // TODO: In a real system, this would trigger the actual payout via a payment gateway.
  // For example:
  // await paymentGateway.transfer(payment.amount, delivery.travelerId, { source: 'escrow_account' });

  return payment;
};

module.exports = {
  createEscrow,
  releaseFunds
};