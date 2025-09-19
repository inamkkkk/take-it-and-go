const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const matchRoutes = require('./matchRoutes');
const trackingRoutes = require('./trackingRoutes');
const paymentRoutes = require('./paymentRoutes');

router.use('/auth', authRoutes);
router.use('/match', matchRoutes);
router.use('/tracking', trackingRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;