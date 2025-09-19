const Joi = require('joi');
const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false, // Include all errors
    allowUnknown: true, // Allow unknown keys (e.g., if a body has extra fields)
    stripUnknown: true, // Strip unknown keys (remove extra fields)
  };

  const { error, value } = schema.validate(req.body, validationOptions);

  if (error) {
    return next(error); // Joi errors are caught by errorHandler
  }

  req.body = value; // Update req.body with validated and stripped value
  next();
};

module.exports = validate;