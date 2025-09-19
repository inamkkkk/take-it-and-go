# Take iT & Go Lite Backend

## Project Overview
This is a simplified Node.js backend for the "Take iT & Go" peer-to-peer delivery platform. It includes core functionalities such as user authentication, route-based matching, mock payments (escrow system), GPS tracking, and real-time chat.

## Features
-   **Authentication**: User signup, login, and password reset with JWT for secure access.
-   **Routes Matching**: Placeholder for finding suitable matches between shippers and travelers based on delivery routes.
-   **GPS Tracking**: Simulate starting, stopping, and retrieving tracking logs for deliveries.
-   **Payments**: Mock escrow system for creating pending payments and releasing funds upon delivery completion.
-   **Real-time Chat**: WebSocket-based chat for direct communication between users involved in a delivery.

## Technology Stack
-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web application framework for building RESTful APIs.
-   **MongoDB**: NoSQL database for data storage.
-   **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
-   **JWT (JSON Web Tokens)**: For secure, stateless authentication with role-based access.
-   **Bcrypt.js**: For password hashing and security.
-   **Joi**: For robust input validation middleware.
-   **Socket.IO**: For real-time, bidirectional communication (chat).
-   **Dotenv**: For managing environment variables.
-   **Winston**: For structured logging.
-   **CORS**: Middleware for enabling Cross-Origin Resource Sharing.

## Project Structure

takeitgo-lite-backend/
├── server.js               # Main entry point for the application
├── package.json            # Project dependencies and scripts
├── .env.example            # Example environment variables file
└── src/
    ├── config/             # Database connection, environment setup
    │   └── db.js
    ├── controllers/        # Request handlers, call services for business logic
    │   ├── authController.js
    │   ├── matchController.js
    │   ├── paymentController.js
    │   └── trackingController.js
    ├── middlewares/        # Express middlewares (auth, error handling, validation, logging)
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   ├── loggerMiddleware.js
    │   └── validationMiddleware.js
    ├── models/             # Mongoose schemas for database collections
    │   ├── Chat.js
    │   ├── Delivery.js
    │   ├── GpsLog.js
    │   ├── Payment.js
    │   └── User.js
    ├── routes/             # API routes
    │   ├── authRoutes.js
    │   ├── index.js        # Aggregates all routes
    │   ├── matchRoutes.js
    │   ├── paymentRoutes.js
    │   └── trackingRoutes.js
    ├── services/           # Business logic, reusable functions
    │   ├── authService.js
    │   ├── matchService.js
    │   ├── paymentService.js
    │   └── trackingService.js
    ├── sockets/            # Socket.IO handlers
    │   └── chatSocket.js
    ├── utils/              # Helper functions (JWT, hashing, logging, custom errors)
    │   ├── apiError.js
    │   ├── hash.js
    │   ├── jwt.js
    │   └── logger.js
    └── validation/         # Joi schemas for input validation
        ├── authValidation.js
        ├── deliveryValidation.js
        └── paymentValidation.js


## Setup and Installation

### Prerequisites
-   Node.js (LTS version recommended)
-   MongoDB (running locally or accessible via a cloud service like MongoDB Atlas)

### Steps
1.  **Clone the repository**:
    
    git clone https://github.com/your-username/takeitgo-lite-backend.git
    cd takeitgo-lite-backend
    

2.  **Install dependencies**:
    
    npm install
    

3.  **Configure Environment Variables**:
    -   Create a `.env` file in the project root directory.
    -   Copy the content from `.env.example` into your `.env` file.
    -   Update the placeholder values, especially `MONGO_URI` and `JWT_SECRET`.
    
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/takeitgo-lite-db
    JWT_SECRET=your_strong_jwt_secret_key_here
    JWT_EXPIRES_IN=1h
    # CLIENT_URL for CORS and Socket.IO (e.g., http://localhost:5173 for a React app)
    CLIENT_URL=*
    
    *Make sure your `JWT_SECRET` is long and complex for production.*

4.  **Start the server**:
    
    npm start
    # Or for development with hot-reloading:
    npm run dev
    
    The API will be available at `http://localhost:3000/api` (or your specified `PORT`).

## API Endpoints (via Express.js)
All API routes are prefixed with `/api`.

### Authentication (`/api/auth`)
-   `POST /api/auth/signup`: Register a new user (shipper or traveler).
    -   **Body**: `email`, `phone`, `password`, `role` (optional, default: 'shipper')
    -   **Response**: `user` object, `token`
-   `POST /api/auth/login`: Log in an existing user.
    -   **Body**: `email`, `password`
    -   **Response**: `user` object, `token`
-   `POST /api/auth/reset-password`: Reset user's password.
    -   **Body**: `email`, `newPassword`
    -   **Response**: `message`

### Route Matching (`/api/match`)
-   `POST /api/match/find` (Protected): Find potential matches for a delivery.
    -   **Body**: `deliveryId`
    -   **Response**: `delivery` object, `matches` array (currently mock data)

### GPS Tracking (`/api/tracking`)
-   `POST /api/tracking/start` (Protected): Start tracking for a delivery.
    -   **Body**: `deliveryId`, `lat`, `lng`
    -   **Response**: `message`, `deliveryId`, `lat`, `lng`
-   `POST /api/tracking/stop` (Protected): Stop tracking and mark a delivery as delivered.
    -   **Body**: `deliveryId`
    -   **Response**: `message`, `deliveryId`
-   `GET /api/tracking/:deliveryId` (Protected): Get tracking history for a delivery.
    -   **Params**: `deliveryId`
    -   **Response**: `delivery` object, `gpsLogs` array

### Payments (`/api/payments`)
-   `POST /api/payments/escrow` (Protected, Shipper role): Create a mock escrow payment.
    -   **Body**: `deliveryId`, `amount`
    -   **Response**: `payment` object
-   `POST /api/payments/release` (Protected, Shipper role): Release mock escrow funds.
    -   **Body**: `deliveryId`
    -   **Response**: `payment` object

## Real-time Chat (Socket.IO)
-   **WebSocket Endpoint**: `ws://localhost:3000/` (or your `PORT`)
-   **Authentication**: Clients should send a JWT token via `socket.handshake.auth.token` or `socket.handshake.query.token` and `deliveryId` via `socket.handshake.query.deliveryId` during connection.
-   **Events**:
    -   `connection`: Fired when a client connects.
    -   `disconnect`: Fired when a client disconnects.
    -   `sendMessage`: Client sends a message.
        -   **Payload**: `{ deliveryId, receiverId, message }`
    -   `newMessage`: Server broadcasts a new message to the chat room.
        -   **Payload**: `{ id, deliveryId, senderId, receiverId, message, timestamp }`
    -   `recentMessages`: Server sends recent messages upon successful connection to a delivery chat.
    -   `authError`, `chatError`: Server sends error messages related to authentication or chat operations.

## TODOs and Enhancements
-   **Routes Matching**: Implement sophisticated algorithms for geographic and time-based matching. Consider integrating with a third-party mapping service (e.g., Google Maps API) for route optimization.
-   **Payment Gateway Integration**: Replace mock payment service with actual integrations (Stripe, PayPal, etc.) for real escrow functionality.
-   **Notifications**: Add push notifications or email/SMS for delivery status updates, chat messages, etc.
-   **Delivery Management**: CRUD operations for deliveries, allowing shippers to create and manage delivery requests, and travelers to accept requests.
-   **User Profiles**: Expand user profiles with more details (e.g., profile picture, vehicle info for travelers, preferred routes).
-   **Admin Panel**: Build an admin interface for managing users, deliveries, and disputes.
-   **Testing**: Implement unit, integration, and end-to-end tests.
-   **API Documentation**: Generate Swagger/OpenAPI documentation (comments already integrated in routes).
-   **Scalability**: Implement caching, message queues, and load balancing for high-traffic scenarios.
