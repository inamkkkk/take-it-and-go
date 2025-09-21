const Joi = require('joi');
const { objectId } = require('./customValidation');

const createEscrow = {
  body: Joi.object().keys({
    deliveryId: Joi.string().custom(objectId).required(),
    amount: Joi.number().min(0).required()
  })
};

const releaseFunds = {
  body: Joi.object().keys({
    paymentId: Joi.string().custom(objectId).required()
  })
};

module.exports = {
  createEscrow,
  releaseFunds
};
