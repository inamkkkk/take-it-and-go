const Joi = require('joi');
const { objectId } = require('./customValidation');

const findMatches = {
  body: Joi.object().keys({
    deliveryId: Joi.string().custom(objectId).required(),
    origin: Joi.object().keys({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    }).optional(),
    destination: Joi.object().keys({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    }).optional(),
    itemType: Joi.string().optional()
  })
};

module.exports = {
  findMatches
};