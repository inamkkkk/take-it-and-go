const Joi = require('joi');
const { objectId } = require('./customValidation');

const findMatches = {
  body: Joi.object().keys({
    deliveryId: Joi.string().custom(objectId).required()
    // TODO: Add more criteria for matching, e.g.,
    // origin: Joi.object().keys({ latitude: Joi.number(), longitude: Joi.number() }),
    // destination: Joi.object().keys({ latitude: Joi.number(), longitude: Joi.number() }),
    // itemType: Joi.string().optional()
  })
};

module.exports = {
  findMatches
};
