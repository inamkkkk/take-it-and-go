const express = require('express');
const trackingController = require('../controllers/trackingController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const trackingValidation = require('../validations/trackingValidation');

const router = express.Router();

router.post('/start', authMiddleware.authenticate, authMiddleware.authorize(['traveler']), validate(trackingValidation.startTracking), trackingController.startTracking);
router.post('/stop', authMiddleware.authenticate, authMiddleware.authorize(['traveler']), validate(trackingValidation.stopTracking), trackingController.stopTracking);
router.get('/:deliveryId', authMiddleware.authenticate, validate(trackingValidation.getTracking), trackingController.getTracking);
router.post('/log', authMiddleware.authenticate, authMiddleware.authorize(['traveler']), validate(trackingValidation.logGPS), trackingController.logGPS);

module.exports = router;