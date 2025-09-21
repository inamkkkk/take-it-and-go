const Chat = require('../models/Chat');
const httpStatus = require('http-status-codes');
const logger = require('../utils/logger');
const Delivery = require('../models/Delivery'); // Assuming Delivery model exists for authorization checks
const mongoose = require('mongoose'); // For ObjectId validation

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
    const userId = req.user.userId; // Assuming userId is available from authentication middleware

    let query = {};

    if (deliveryId) {
      if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid delivery ID format.' });
      }

      // TODO: Implement authorization - only participants of the chat/delivery should see history.
      // Fetch the delivery to check participants
      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        return res.status(httpStatus.NOT_FOUND).send({ message: 'Delivery not found.' });
      }

      const isParticipant = delivery.participants.some(participant => participant.toString() === userId);
      if (!isParticipant) {
        return res.status(httpStatus.UNAUTHORIZED).send({ message: 'You are not authorized to view this delivery\'s chat history.' });
      }

      query.deliveryId = deliveryId;

    } else if (senderId && receiverId) {
      if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid sender or receiver ID format.' });
      }
      // Basic authorization check: Ensure the logged-in user is one of the sender or receiver
      if (senderId !== userId && receiverId !== userId) {
        return res.status(httpStatus.UNAUTHORIZED).send({ message: 'You can only view chats involving yourself.' });
      }

      query.$or = [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ];
    } else {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'Missing deliveryId or senderId/receiverId pair.' });
    }

    const messages = await Chat.find(query).sort({ timestamp: 1 }).populate('senderId', 'email phone').populate('receiverId', 'email phone');

    res.status(httpStatus.OK).send(messages);
  } catch (error) {
    logger.error('Error fetching chat history:', error);
    // Provide a more specific error message if it's a known issue like invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid ID format provided.' });
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Error fetching chat history.' });
  }
};

module.exports = {
  getChatHistory
};