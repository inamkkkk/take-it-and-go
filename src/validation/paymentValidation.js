const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createEscrowSchema = Joi.object({
  deliveryId: Joi.objectId().required(),
  amount: Joi.number().min(0).required(),
});

const releaseFundsSchema = Joi.object({
  deliveryId: Joi.objectId().required(),
});

module.exports = {
  createEscrowSchema,
  releaseFundsSchema,
};