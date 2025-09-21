const express = require('express');
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const matchValidation = require('../validations/matchValidation');

const router = express.Router();

// TODO: Add routes for fetching, updating, accepting/rejecting matches.
// Example for fetching matches:
router.get('/my', authMiddleware.authenticate, authMiddleware.authorize(['shipper', 'driver']), matchController.getMyMatches);

// Route to find potential matches
router.post('/find', authMiddleware.authenticate, authMiddleware.authorize(['shipper']), validate(matchValidation.findMatches), matchController.findMatches);

// Route to accept a match
router.post('/accept/:matchId', authMiddleware.authenticate, authMiddleware.authorize(['shipper', 'driver']), matchController.acceptMatch);

// Route to reject a match
router.post('/reject/:matchId', authMiddleware.authenticate, authMiddleware.authorize(['shipper', 'driver']), matchController.rejectMatch);

module.exports = router;