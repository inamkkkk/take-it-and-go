require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./src/utils/logger');
const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');
const loggerMiddleware = require('./src/middlewares/loggerMiddleware');
const chatSocketHandler = require('./src/sockets/chatSocket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*", // Adjust for your client app's origin
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(loggerMiddleware);

// API routes
app.use('/api', apiRoutes);

// Socket.IO handler
chatSocketHandler(io);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Take iT & Go Lite API is running!' });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start the server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Access API at http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});