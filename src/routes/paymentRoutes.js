const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const paymentValidation = require('../validations/paymentValidation');

const router = express.Router();

router.post('/escrow', authMiddleware.authenticate, authMiddleware.authorize(['shipper']), validate(paymentValidation.createEscrow), paymentController.createEscrow);
router.post('/release', authMiddleware.authenticate, authMiddleware.authorize(['shipper']), validate(paymentValidation.releaseFunds), paymentController.releaseFunds);

module.exports = router;