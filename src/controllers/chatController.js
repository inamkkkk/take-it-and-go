const Chat = require('../models/Chat');
const httpStatus = require('http-status-codes');
const logger = require('../utils/logger');
// Note: This controller is primarily for HTTP-based interactions like fetching chat history.
// Real-time chat handling is typically done directly in the socket handler.

/**
 * Get chat messages for a specific delivery or between two users.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatHistory = async (req, res) => {
  try {
    const { deliveryId, senderId, receiverId } = req.query;
    let query = {};

    if (deliveryId) {
      query.deliveryId = deliveryId;
    } else if (senderId && receiverId) {
      query.$or = [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ];
    } else {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'Missing deliveryId or senderId/receiverId pair.' });
    }

    // TODO: Implement authorization - only participants of the chat/delivery should see history.
    const messages = await Chat.find(query).sort({ timestamp: 1 }).populate('senderId', 'email phone').populate('receiverId', 'email phone');

    res.status(httpStatus.OK).send(messages);
  } catch (error) {
    logger.error('Error fetching chat history:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Error fetching chat history.' });
  }
};

module.exports = {
  getChatHistory
};
