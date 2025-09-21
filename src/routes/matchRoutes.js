const express = require('express');
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const matchValidation = require('../validations/matchValidation');

const router = express.Router();

router.post('/find', authMiddleware.authenticate, authMiddleware.authorize(['shipper']), validate(matchValidation.findMatches), matchController.findMatches);

module.exports = router;
