const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const authValidation = require('../validations/authValidation');

const router = express.Router();

router.post('/signup', validate(authValidation.signup), authController.signup);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

// TODO: Add a route for password reset confirmation
// router.post('/reset-password-confirm', validate(authValidation.resetPasswordConfirm), authController.resetPasswordConfirm);

// TODO: Add a route for refreshing JWT tokens
// router.post('/refresh-token', authController.refreshToken);

module.exports = router;