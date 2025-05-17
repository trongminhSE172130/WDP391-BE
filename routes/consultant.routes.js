const express = require("express");
const {
  getAllConsultants,
  getConsultantById,
  createConsultant,
  updateConsultant,
  deleteConsultant,
} = require("../controllers/consultantController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /consultants:
 *   get:
 *     summary: Get all consultants
 *     tags: [Consultants]
 *     responses:
 *       200:
 *         description: List of consultants
 */
router.get("/", getAllConsultants);

/**
 * @swagger
 * /consultants/{id}:
 *   get:
 *     summary: Get consultant by ID
 *     tags: [Consultants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the consultant
 *     responses:
 *       200:
 *         description: Consultant found
 *       404:
 *         description: Consultant not found
 */
router.get("/:id", getConsultantById);

/**
 * @swagger
 * /consultants:
 *   post:
 *     summary: Create a new consultant
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - degree
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               degree:
 *                 type: string
 *               experience_years:
 *                 type: integer
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consultant created successfully
 */
router.post("/", protect, authorize("admin"), createConsultant);

/**
 * @swagger
 * /consultants/{id}:
 *   put:
 *     summary: Update a consultant
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the consultant
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               degree:
 *                 type: string
 *               experience_years:
 *                 type: integer
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Consultant updated successfully
 *       404:
 *         description: Consultant not found
 */
router.put("/:id", protect, authorize("admin"), updateConsultant);

/**
 * @swagger
 * /consultants/{id}:
 *   delete:
 *     summary: Delete a consultant
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the consultant
 *     responses:
 *       200:
 *         description: Consultant deleted successfully
 *       404:
 *         description: Consultant not found
 */
router.delete("/:id", protect, authorize("admin"), deleteConsultant);

module.exports = router;
