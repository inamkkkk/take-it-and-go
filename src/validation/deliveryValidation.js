const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const locationSchema = Joi.object({
  address: Joi.string().required(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

const createDeliverySchema = Joi.object({
  shipperId: Joi.objectId().required(), // Assuming shipperId is passed in body for creation
  pickup: locationSchema.required(),
  drop: locationSchema.required(),
  itemDescription: Joi.string().max(500).optional(),
  price: Joi.number().min(0).optional(),
});

const findMatchesSchema = Joi.object({
  deliveryId: Joi.objectId().required(),
});

const startTrackingSchema = Joi.object({
  deliveryId: Joi.objectId().required(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

const stopTrackingSchema = Joi.object({
  deliveryId: Joi.objectId().required(),
});

const getTrackingSchema = Joi.object({
  deliveryId: Joi.objectId().required(),
});

module.exports = {
  createDeliverySchema,
  findMatchesSchema,
  startTrackingSchema,
  stopTrackingSchema,
  getTrackingSchema,
};