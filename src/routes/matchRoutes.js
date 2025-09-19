const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { findMatchesSchema } = require('../validation/deliveryValidation');

/**
 * @swagger
 * /match/find:
 *   post:
 *     summary: Find potential matches for a delivery request
 *     tags: [Matching]
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
 *         description: List of potential matches
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
 *                     matches:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, example: 'mockTraveler1' }
 *                           name: { type: string, example: 'John Doe' }
 *                           rating: { type: number, example: 4.8 }
 *                           estimatedRouteOverlap: { type: string, example: '80%' }
 *                           pickupTime: { type: string, format: date-time }
 *                           dropoffTime: { type: string, format: date-time }
 *                     message: { type: string, example: 'Matching logic pending, returning mock data.' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Delivery not found
 */
router.post('/find', protect, authorize('shipper', 'traveler'), validate(findMatchesSchema), matchController.findMatches);

module.exports = router;