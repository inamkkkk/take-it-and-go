const Chat = require('../models/Chat');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const handleChat = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Authenticate user via JWT token from handshake query or extraHeaders
    let userId = null;
    let userRole = null;
    const token = socket.handshake.query.token || socket.handshake.auth.token;

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        userId = decoded.id;
        userRole = decoded.role;
        socket.userId = userId; // Store user ID on the socket for later use
        socket.userRole = userRole;
        logger.info(`User ${userId} (${userRole}) authenticated for socket ${socket.id}`);
      } catch (err) {
        logger.warn(`Socket authentication failed for ${socket.id}: ${err.message}`);
        socket.disconnect(true);
        return;
      }
    } else {
      logger.warn(`Socket ${socket.id} tried to connect without a token.`);
      socket.disconnect(true);
      return;
    }

    // Join a room based on deliveryId or a general chat room between two users
    socket.on('joinRoom', async (data, callback) => {
      // data should contain { deliveryId: '...', otherUserId: '...' } or just { deliveryId: '...' }
      const { deliveryId, otherUserId } = data;
      let roomName;

      if (deliveryId) {
        roomName = `delivery_${deliveryId}`;
      } else if (otherUserId) {
        // Create a consistent room name for direct messages between two users
        const participants = [socket.userId.toString(), otherUserId.toString()].sort();
        roomName = `chat_${participants[0]}_${participants[1]}`;
      } else {
        logger.warn(`Socket ${socket.id} tried to join a room without valid ID.`);
        if (callback) callback({ status: 'error', message: 'Invalid room ID provided.' });
        return;
      }

      socket.join(roomName);
      logger.info(`User ${socket.userId} joined room: ${roomName}`);
      if (callback) callback({ status: 'ok', room: roomName });

      // TODO: Fetch and send recent chat history for this room to the joining user.
      // This can be done by calling chatController.getChatHistory service logic.
    });

    socket.on('sendMessage', async (data, callback) => {
      // data should contain { roomName: '...', message: '...', receiverId: '...' (optional) }
      const { roomName, message, receiverId, deliveryId } = data;

      if (!socket.userId) {
        logger.warn(`Unauthenticated socket ${socket.id} tried to send message.`);
        if (callback) callback({ status: 'error', message: 'Authentication required.' });
        return;
      }
      if (!roomName || !message) {
        if (callback) callback({ status: 'error', message: 'Room name and message are required.' });
        return;
      }

      try {
        // Save message to DB
        const chatMessage = await Chat.create({
          senderId: socket.userId,
          receiverId: receiverId || null, // Can be null for delivery-specific group chats
          deliveryId: deliveryId || null,
          message: message,
          timestamp: new Date(),
          readBy: [socket.userId] // Sender has read it
        });

        // Emit message to all clients in the room
        io.to(roomName).emit('receiveMessage', {
          _id: chatMessage._id,
          senderId: socket.userId,
          receiverId: receiverId,
          deliveryId: deliveryId,
          message: message,
          timestamp: chatMessage.timestamp,
          senderInfo: { id: socket.userId, role: socket.userRole } // Optionally send sender's info
        });
        logger.info(`User ${socket.userId} sent message to room ${roomName}`);

        if (callback) callback({ status: 'ok', messageId: chatMessage._id });
      } catch (error) {
        logger.error(`Error sending message: ${error.message}`);
        if (callback) callback({ status: 'error', message: 'Failed to send message.' });
      }
    });

    socket.on('markAsRead', async (data, callback) => {
      const { messageId } = data;
      if (!socket.userId || !messageId) {
        if (callback) callback({ status: 'error', message: 'Authentication and message ID required.' });
        return;
      }
      try {
        const message = await Chat.findById(messageId);
        if (message && !message.readBy.includes(socket.userId)) {
          message.readBy.push(socket.userId);
          await message.save();
          io.to(message.deliveryId ? `delivery_${message.deliveryId}` : null) // Or direct chat room
            .emit('messageRead', { messageId, readerId: socket.userId });
          if (callback) callback({ status: 'ok' });
        }
      } catch (error) {
        logger.error(`Error marking message as read: ${error.message}`);
        if (callback) callback({ status: 'error', message: 'Failed to mark message as read.' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      // TODO: Clean up any active tracking sessions or user states if necessary.
    });

    socket.on('error', (err) => {
      logger.error(`Socket error for ${socket.id}: ${err.message}`);
    });
  });
};

module.exports = {
  handleChat
};
