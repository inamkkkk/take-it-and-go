require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./db/connection');
const config = require('./config/config');
const logger = require('./utils/logger');
const chatSocket = require('./sockets/chatSocket');

const PORT = config.port;
const MONGO_URI = config.mongoURI;

// Connect to MongoDB
connectDB(MONGO_URI);

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

// Handle chat sockets
chatSocket.handleChat(io);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      // process.exit(1); // Removed to allow graceful shutdown in SIGTERM
    });
  }
  // Removed else { process.exit(1); } as the process will exit after server close or if server is not defined.
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close(() => {
      logger.info('Server closed after SIGTERM');
      process.exit(0); // Graceful exit
    });
  } else {
    process.exit(0); // Graceful exit if server is not running
  }
});