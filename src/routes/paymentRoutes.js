const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { createEscrowSchema, releaseFundsSchema } = require('../validation/paymentValidation');

/**
 * @swagger
 * /payments/escrow:
 *   post:
 *     summary: Create a mock escrow payment for a delivery
 *     tags: [Payments]
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
 *               - amount
 *             properties:
 *               deliveryId:
 *                 type: string
 *                 format: uuid
 *                 example: '656209b5a8e2a2a07c3b8e1a'
 *               amount:
 *                 type: number
 *                 example: 25.50
 *     responses:
 *       200:
 *         description: Escrow created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Payment' }
 *       400:
 *         description: Bad request (e.g., delivery status invalid, escrow already exists)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only shipper can create escrow)
 *       404:
 *         description: Delivery not found
 */
router.post('/escrow', protect, authorize('shipper'), validate(createEscrowSchema), paymentController.createEscrow);

/**
 * @swagger
 * /payments/release:
 *   post:
 *     summary: Release mock escrow funds for a delivered package
 *     tags: [Payments]
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
 *         description: Funds released successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Payment' }
 *       400:
 *         description: Bad request (e.g., delivery not delivered, no pending escrow)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only shipper can release funds)
 *       404:
 *         description: Delivery or pending payment not found
 */
router.post('/release', protect, authorize('shipper'), validate(releaseFundsSchema), paymentController.releaseFunds);

module.exports = router;