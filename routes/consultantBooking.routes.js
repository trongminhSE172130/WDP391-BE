const express = require("express");
const {
  getAllBookings,
  getBookingById,
  getUserBookings,
  getConsultantBookings,
  getPendingBookings,
  createBooking,
  confirmBooking,
  cancelBooking,
  completeBooking,
  deleteBooking,
} = require("../controllers/consultantBookingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /consultant-bookings:
 *   get:
 *     summary: Get all bookings (admin only)
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get("/", protect, authorize("admin"), getAllBookings);

/**
 * @swagger
 * /consultant-bookings/user:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 */
router.get("/user", protect, getUserBookings);

/**
 * @swagger
 * /consultant-bookings/consultant/{consultantId}:
 *   get:
 *     summary: Get bookings for a consultant
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consultantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the consultant
 *     responses:
 *       200:
 *         description: List of bookings for the consultant
 */
router.get("/consultant/:consultantId", protect, getConsultantBookings);

/**
 * @swagger
 * /consultant-bookings/pending/{consultantId}:
 *   get:
 *     summary: Get pending bookings for a consultant
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consultantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the consultant
 *     responses:
 *       200:
 *         description: List of pending bookings
 */
router.get("/pending/:consultantId", protect, getPendingBookings);

/**
 * @swagger
 * /consultant-bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the booking
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get("/:id", protect, getBookingById);

/**
 * @swagger
 * /consultant-bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultant_schedule_id
 *               - question
 *             properties:
 *               consultant_schedule_id:
 *                 type: string
 *               question:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post("/", protect, createBooking);

/**
 * @swagger
 * /consultant-bookings/{id}/confirm:
 *   put:
 *     summary: Confirm a booking
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - meeting_link
 *             properties:
 *               meeting_link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking confirmed successfully
 *       404:
 *         description: Booking not found
 */
router.put("/:id/confirm", protect, confirmBooking);

/**
 * @swagger
 * /consultant-bookings/{id}/cancel:
 *   put:
 *     summary: Cancel a booking
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the booking
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       404:
 *         description: Booking not found
 */
router.put("/:id/cancel", protect, cancelBooking);

/**
 * @swagger
 * /consultant-bookings/{id}/complete:
 *   put:
 *     summary: Mark a booking as completed
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the booking
 *     responses:
 *       200:
 *         description: Booking completed successfully
 *       404:
 *         description: Booking not found
 */
router.put("/:id/complete", protect, completeBooking);

/**
 * @swagger
 * /consultant-bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Consultant Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the booking
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", protect, deleteBooking);

module.exports = router;
