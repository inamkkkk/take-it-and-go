const Joi = require('joi');

// Custom Joi validation for Mongoose ObjectId
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('{{#label}} must be a valid mongo id');
  }
  return value;
};

// Define other custom validations here if needed
// For example, for coordinates:
const coordinates = (value, helpers) => {
  if (!Array.isArray(value) || value.length !== 2 || typeof value[0] !== 'number' || typeof value[1] !== 'number') {
    return helpers.message('{{#label}} must be an array of [longitude, latitude]');
  }
  // Basic longitude and latitude validation
  if (value[0] < -180 || value[0] > 180) {
    return helpers.message('{{#label}} longitude must be between -180 and 180');
  }
  if (value[1] < -90 || value[1] > 90) {
    return helpers.message('{{#label}} latitude must be between -90 and 90');
  }
  return value;
};

module.exports = {
  objectId,
  coordinates
};
