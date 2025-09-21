const Joi = require('joi');
const httpStatus = require('http-status-codes');
const AppError = require('../utils/appError');

const validate = (schema) => (req, res, next) => {
  const validSchema = ['params', 'query', 'body'].reduce((acc, key) => {
    if (schema[key]) {
      acc[key] = schema[key];
    }
    return acc;
  }, {});

  const object = ['params', 'query', 'body'].reduce((acc, key) => {
    if (schema[key]) {
      acc[key] = req[key];
    }
    return acc;
  }, {});

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    // TODO: Implement more granular error handling for Joi validation errors.
    // For now, we'll join all error messages for simplicity.
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new AppError(errorMessage, httpStatus.BAD_REQUEST));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;