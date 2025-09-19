const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { startTrackingSchema, stopTrackingSchema, getTrackingSchema } = require('../validation/deliveryValidation');

/**
 * @swagger
 * /tracking/start:
 *   post:
 *     summary: Start GPS tracking for a delivery
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *               - lat
 *               - lng
 *             properties:
 *               deliveryId:
 *                 type: string
 *                 format: uuid
 *                 example: '656209b5a8e2a2a07c3b8e1a'
 *               lat:
 *                 type: number
 *                 format: float
 *                 example: 34.052235
 *               lng:
 *                 type: number
 *                 format: float
 *                 example: -118.243683
 *     responses:
 *       200:
 *         description: Tracking started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object, properties: { message: { type: string }, deliveryId: { type: string }, lat: { type: number }, lng: { type: number } } }
 *       400:
 *         description: Bad request (e.g., delivery not in transit, already delivered)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Delivery not found
 */
router.post('/start', protect, authorize('traveler', 'shipper'), validate(startTrackingSchema), trackingController.startTracking);

/**
 * @swagger
 * /tracking/stop:
 *   post:
 *     summary: Stop GPS tracking for a delivery and mark as delivered
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *             properties:
 *               deliveryId:
 *                 type: string
 *                 format: uuid
 *                 example: '656209b5a8e2a2a07c3b8e1a'
 *     responses:
 *       200:
 *         description: Tracking stopped and delivery marked as delivered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object, properties: { message: { type: string }, deliveryId: { type: string } } }
 *       400:
 *         description: Bad request (e.g., delivery not in transit)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Delivery not found
 */
router.post('/stop', protect, authorize('traveler'), validate(stopTrackingSchema), trackingController.stopTracking);

/**
 * @swagger
 * /tracking/{deliveryId}:
 *   get:
 *     summary: Get GPS tracking history for a delivery
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the delivery to track
 *     responses:
 *       200:
 *         description: GPS tracking data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     delivery: { $ref: '#/components/schemas/Delivery' }
 *                     gpsLogs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/GpsLog'
 *                     message: { type: string, example: 'Tracking data retrieved successfully.' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Delivery not found
 */
router.get('/:deliveryId', protect, authorize('shipper', 'traveler'), validate(getTrackingSchema), trackingController.getTracking);

module.exports = router;