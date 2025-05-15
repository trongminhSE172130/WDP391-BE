const express = require("express");
const {
  getUserNotifications,
  processPendingNotifications,
} = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user's notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get("/", protect, getUserNotifications);

/**
 * @swagger
 * /notifications/process-pending:
 *   post:
 *     summary: Process pending notifications (admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications processed
 */
router.post(
  "/process-pending",
  protect,
  authorize("admin"),
  processPendingNotifications
);

module.exports = router;
