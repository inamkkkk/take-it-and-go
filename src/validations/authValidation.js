const Joi = require('joi');

const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    phone: Joi.string()
      .required()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .messages({ 'string.pattern.base': `Phone number must be a valid E.164 format.` }),
    password: Joi.string().required().min(8).max(30).messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 30 characters'
    }),
    role: Joi.string().valid('shipper', 'traveler').default('shipper')
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    newPassword: Joi.string().required().min(8).max(30).messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.max': 'New password must not exceed 30 characters'
    })
  })
};

module.exports = {
  signup,
  login,
  resetPassword
};
