const Joi = require('joi');
const { objectId, coordinates } = require('./customValidation');

const startTracking = {
  body: Joi.object().keys({
    deliveryId: Joi.string().custom(objectId).required()
  })
};

const stopTracking = {
  body: Joi.object().keys({
    deliveryId: Joi.string().custom(objectId).required()
  })
};

const getTracking = {
  params: Joi.object().keys({
    deliveryId: Joi.string().custom(objectId).required()
  })
};

const logGPS = {
  body: Joi.object().keys({
    deliveryId: Joi.string().custom(objectId).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
  })
};

module.exports = {
  startTracking,
  stopTracking,
  getTracking,
  logGPS
};