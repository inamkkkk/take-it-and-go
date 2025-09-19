class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Mark as operational error (known issues)

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;