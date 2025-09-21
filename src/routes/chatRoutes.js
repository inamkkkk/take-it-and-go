const express = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
// No Joi validation for simple GET query for now, but could be added.

const router = express.Router();

// Route to get chat history via HTTP. Real-time chat handled by websockets.
router.get('/history', authMiddleware.authenticate, chatController.getChatHistory);

module.exports = router;