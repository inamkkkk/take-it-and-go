const express = require('express');
const authRoutes = require('./authRoutes');
const matchRoutes = require('./matchRoutes');
const paymentRoutes = require('./paymentRoutes');
const trackingRoutes = require('./trackingRoutes');
const chatRoutes = require('./chatRoutes'); // For HTTP chat history

const router = express.Router();

const defaultRoutes = [
  { path: '/auth', route: authRoutes },
  { path: '/match', route: matchRoutes },
  { path: '/payments', route: paymentRoutes },
  { path: '/tracking', route: trackingRoutes },
  { path: '/chat', route: chatRoutes } // For HTTP chat history
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// TODO: Add a root route handler for '/' or a health check endpoint if needed.
// Example:
// router.get('/', (req, res) => {
//   res.status(200).send('API is running');
// });

module.exports = router;