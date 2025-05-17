const express = require("express");
const {
  getAllSchedules,
  getSchedulesByConsultant,
  getAvailableSchedulesByConsultant,
  getAvailableSchedulesByDate,
  createSchedule,
  createBulkSchedules,
  updateSchedule,
  deleteSchedule,
  getAvailableTimeSlots,
} = require("../controllers/consultantScheduleController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /consultant-schedules:
 *   get:
 *     summary: Get all schedules
 *     tags: [Consultant Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schedules
 */
router.get("/", protect, authorize("admin"), getAllSchedules);

/**
 * @swagger
 * /consultant-schedules/consultant/{consultantId}:
 *   get:
 *     summary: Get schedules by consultant
 *     tags: [Consultant Schedules]
 *     parameters:
 *       - in: path
 *         name: consultantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the consultant
 *     responses:
 *       200:
 *         description: List of schedules
 */
router.get("/consultant/:consultantId", getSchedulesByConsultant);

/**
 * @swagger
 * /consultant-schedules/available/consultant/{consultantId}:
 *   get:
 *     summary: Get available schedules by consultant
 *     tags: [Consultant Schedules]
 *     parameters:
 *       - in: path
 *         name: consultantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the consultant
 *     responses:
 *       200:
 *         description: List of available schedules
 */
router.get(
  "/available/consultant/:consultantId",
  getAvailableSchedulesByConsultant
);

/**
 * @swagger
 * /consultant-schedules/available/date:
 *   get:
 *     summary: Get available schedules by date
 *     tags: [Consultant Schedules]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check (defaults to today)
 *     responses:
 *       200:
 *         description: List of available schedules
 */
router.get("/available/date", getAvailableSchedulesByDate);

/**
 * @swagger
 * /consultant-schedules/available/time-slots:
 *   get:
 *     summary: Get available time slots by consultant and date
 *     tags: [Consultant Schedules]
 *     parameters:
 *       - in: query
 *         name: consultantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the consultant
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date to check
 *     responses:
 *       200:
 *         description: List of available time slots
 */
router.get("/available/time-slots", getAvailableTimeSlots);

/**
 * @swagger
 * /consultant-schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags: [Consultant Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultant_id
 *               - date
 *               - time_slot
 *             properties:
 *               consultant_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time_slot:
 *                 type: string
 *     responses:
 *       201:
 *         description: Schedule created successfully
 */
router.post("/", protect, authorize("admin"), createSchedule);

/**
 * @swagger
 * /consultant-schedules/bulk:
 *   post:
 *     summary: Create multiple schedules
 *     tags: [Consultant Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schedules
 *             properties:
 *               schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - consultant_id
 *                     - date
 *                     - time_slot
 *                   properties:
 *                     consultant_id:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     time_slot:
 *                       type: string
 *     responses:
 *       201:
 *         description: Schedules created successfully
 */
router.post("/bulk", protect, authorize("admin"), createBulkSchedules);

/**
 * @swagger
 * /consultant-schedules/{id}:
 *   put:
 *     summary: Update a schedule
 *     tags: [Consultant Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the schedule
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               consultant_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time_slot:
 *                 type: string
 *               is_booked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       404:
 *         description: Schedule not found
 */
router.put("/:id", protect, authorize("admin"), updateSchedule);

/**
 * @swagger
 * /consultant-schedules/{id}:
 *   delete:
 *     summary: Delete a schedule
 *     tags: [Consultant Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the schedule
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 */
router.delete("/:id", protect, authorize("admin"), deleteSchedule);

module.exports = router;
