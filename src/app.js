const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const httpStatus = require('http-status-codes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const config = require('./config/config');

const app = express();

// Morgan for logging HTTP requests
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());
app.options('*', cors());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Handle 404 Not Found errors
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, httpStatus.NOT_FOUND));
});

// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
