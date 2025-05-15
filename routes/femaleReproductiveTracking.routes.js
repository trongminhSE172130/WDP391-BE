const express = require("express");
const {
  createCycle,
  getUserCycles,
  getCurrentCycle,
  updateCycle,
  deleteCycle,
  addSymptom,
  removeSymptom,
  getFertilityStatus,
  getNextPeriodPrediction,
} = require("../controllers/femaleReproductiveTrackingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes need to be protected
router.use(protect);

/**
 * @swagger
 * /female-reproductive-tracking:
 *   post:
 *     summary: Create a new menstrual cycle record
 *     tags: [Female Reproductive Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cycle_start_date
 *             properties:
 *               cycle_start_date:
 *                 type: string
 *                 format: date
 *               cycle_length:
 *                 type: integer
 *               period_length:
 *                 type: integer
 *               notes:
 *                 type: string
 *               remind_pill:
 *                 type: boolean
 *               pill_time:
 *                 type: string
 *               pill_start_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Cycle created successfully
 */
router.post("/", createCycle);

/**
 * @swagger
 * /female-reproductive-tracking:
 *   get:
 *     summary: Get user's menstrual cycle records
 *     tags: [Female Reproductive Tracking]
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
 *         description: List of cycle records
 */
router.get("/", getUserCycles);

/**
 * @swagger
 * /female-reproductive-tracking/current:
 *   get:
 *     summary: Get user's current menstrual cycle
 *     tags: [Female Reproductive Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current cycle data
 *       404:
 *         description: No cycle data found
 */
router.get("/current", getCurrentCycle);

/**
 * @swagger
 * /female-reproductive-tracking/{cycleId}:
 *   put:
 *     summary: Update a cycle record
 *     tags: [Female Reproductive Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cycleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cycle
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cycle_start_date:
 *                 type: string
 *                 format: date
 *               cycle_length:
 *                 type: integer
 *               period_length:
 *                 type: integer
 *               notes:
 *                 type: string
 *               remind_pill:
 *                 type: boolean
 *               pill_time:
 *                 type: string
 *               pill_start_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Cycle updated successfully
 *       404:
 *         description: Cycle not found
 */
router.put("/:cycleId", updateCycle);

/**
 * @swagger
 * /female-reproductive-tracking/{cycleId}:
 *   delete:
 *     summary: Delete a cycle record
 *     tags: [Female Reproductive Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cycleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cycle
 *     responses:
 *       200:
 *         description: Cycle deleted successfully
 *       404:
 *         description: Cycle not found
 */
router.delete("/:cycleId", deleteCycle);

/**
 * @swagger
 * /female-reproductive-tracking/{cycleId}/symptoms:
 *   post:
 *     summary: Add a symptom to a cycle
 *     tags: [Female Reproductive Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cycleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cycle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - type
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *                 enum: [cramps, headache, bloating, mood_swings, fatigue, acne, other]
 *               severity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Symptom added successfully
 *       404:
 *         description: Cycle not found
 */
router.post("/:cycleId/symptoms", addSymptom);

/**
 * @swagger
 * /female-reproductive-tracking/{cycleId}/symptoms/{symptomId}:
 *   delete:
 *     summary: Remove a symptom from a cycle
 *     tags: [Female Reproductive Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cycleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cycle
 *       - in: path
 *         name: symptomId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the symptom to remove
 *     responses:
 *       200:
 *         description: Symptom removed successfully
 *       404:
 *         description: Cycle or symptom not found
 */
router.delete("/:cycleId/symptoms/:symptomId", removeSymptom);

/**
 * @swagger
 * /female-reproductive-tracking/fertility-status:
 *   get:
 *     summary: Get fertility status for a specific date
 *     tags: [Female Reproductive Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check (defaults to today)
 *     responses:
 *       200:
 *         description: Fertility status
 */
router.get("/fertility-status", getFertilityStatus);

/**
 * @swagger
 * /female-reproductive-tracking/next-period:
 *   get:
 *     summary: Get prediction for next period
 *     tags: [Female Reproductive Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Next period prediction
 *       404:
 *         description: No cycle data found
 */
router.get("/next-period", getNextPeriodPrediction);

module.exports = router;
