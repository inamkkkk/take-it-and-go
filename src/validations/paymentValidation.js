const Joi = require('joi');
const { objectId } = require('./customValidation');

const createEscrow = {
  body: Joi.object().keys({
    deliveryId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Delivery ID is required.',
      'string.pattern.base': 'Delivery ID must be a valid ObjectId.'}),
    amount: Joi.number().min(0).required().messages({
      'any.required': 'Amount is required.',
      'number.min': 'Amount cannot be negative.'})})};

const releaseFunds = {
  body: Joi.object().keys({
    paymentId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Payment ID is required.',
      'string.pattern.base': 'Payment ID must be a valid ObjectId.'})})};

module.exports = {
  createEscrow,
  releaseFunds};