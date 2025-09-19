const logger = require('../utils/logger');
const Chat = require('../models/Chat');
const Delivery = require('../models/Delivery');
// Assuming JWT verification for socket connections
const { verifyToken } = require('../utils/jwt');

const chatSocketHandler = (io) => {
  io.on('connection', async (socket) => {
    logger.info(`New socket connection: ${socket.id}`);

    // TODO: Implement authentication for WebSocket connection
    // 1. Client should send a JWT token upon connection (e.g., as part of handshake query or first message).
    // 2. Verify the token to identify the user and their role.
    // 3. If authentication fails, disconnect the socket.
    // For now, using a placeholder user ID.
    let userId = null;
    let userRole = null;
    let deliveryId = null; // The delivery for which chat is being opened

    try {
      const token = socket.handshake.auth.token; // Or socket.handshake.query.token
      if (!token) {
        throw new Error('Authentication token not provided');
      }
      const decoded = verifyToken(token);
      userId = decoded.id;
      userRole = decoded.role;
      deliveryId = socket.handshake.query.deliveryId; // Assume deliveryId is sent as a query param

      if (!deliveryId) {
        throw new Error('Delivery ID not provided for chat');
      }

      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        throw new Error('Delivery not found');
      }

      // Check if the user is part of this delivery (shipper or traveler)
      if (delivery.shipperId.toString() !== userId && (delivery.travelerId && delivery.travelerId.toString() !== userId)) {
        throw new Error('Not authorized to chat for this delivery');
      }

      // Join a room specific to this delivery chat
      socket.join(`delivery_chat_${deliveryId}`);
      logger.info(`User ${userId} (${userRole}) joined chat for delivery ${deliveryId} via socket ${socket.id}`);

      // Load recent messages for this delivery
      const recentMessages = await Chat.find({ deliveryId })
        .sort({ timestamp: -1 })
        .limit(50)
        .populate('senderId', 'email') // Populate sender info
        .populate('receiverId', 'email') // Populate receiver info
        .lean();
      socket.emit('recentMessages', recentMessages.reverse());

    } catch (error) {
      logger.error(`Socket authentication/setup failed for ${socket.id}: ${error.message}`);
      socket.emit('authError', { message: error.message });
      return socket.disconnect(true);
    }

    socket.on('sendMessage', async (data) => {
      // TODO: Implement real-time chat message handling
      // Steps:
      // 1. Validate incoming message data (senderId, receiverId, message content, deliveryId).
      // 2. Store the message in the `Chat` model.
      // 3. Emit the message to all connected clients in the specific delivery room.
      // 4. Handle potential errors during message storage.

      const { receiverId, message } = data;

      if (!userId || !deliveryId) {
        logger.warn(`Attempt to send message without authenticated user or delivery ID: ${socket.id}`);
        return socket.emit('chatError', { message: 'Unauthorized or delivery not specified.' });
      }

      if (!message || message.trim().length === 0) {
        return socket.emit('chatError', { message: 'Message cannot be empty.' });
      }

      try {
        const newChatMessage = await Chat.create({
          deliveryId,
          senderId: userId,
          receiverId,
          message: message.trim(),
          timestamp: new Date(),
        });

        // Broadcast the new message to everyone in the delivery's chat room
        io.to(`delivery_chat_${deliveryId}`).emit('newMessage', {
          id: newChatMessage._id,
          deliveryId: newChatMessage.deliveryId,
          senderId: newChatMessage.senderId,
          receiverId: newChatMessage.receiverId,
          message: newChatMessage.message,
          timestamp: newChatMessage.timestamp,
          senderEmail: newChatMessage.senderId.email, // Assuming populated
          receiverEmail: newChatMessage.receiverId.email, // Assuming populated
        });

        logger.info(`Message sent in delivery ${deliveryId} from ${userId} to ${receiverId}: ${message}`);

      } catch (error) {
        logger.error(`Error sending message for delivery ${deliveryId}: ${error.message}`);
        socket.emit('chatError', { message: 'Failed to send message.' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      if (userId && deliveryId) {
        logger.info(`User ${userId} left chat for delivery ${deliveryId}`);
      }
    });

    socket.on('error', (err) => {
      logger.error(`Socket ${socket.id} error: ${err.message}`);
    });
  });
};

module.exports = chatSocketHandler;