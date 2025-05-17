const express = require("express");
const {
  register,
  login,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a user
 *     tags: [Authentication]
 *     description: Register a new user. All users are automatically assigned the "user" role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               dob:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         gender:
 *                           type: string
 *                         dob:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         role:
 *                           type: string
 *                           description: Always set to "user" for new registrations
 *                           example: user
 *                     token:
 *                       type: string
 *       400:
 *         description: Bad request
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     dob:
 *                       type: string
 *                       format: date
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /auth/updatepassword:
 *   put:
 *     summary: Update password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       401:
 *         description: Unauthorized
 */
router.put("/updatepassword", protect, updatePassword);

/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: Forgot password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 *       400:
 *         description: Bad request
 */
router.post("/forgotpassword", forgotPassword);

/**
 * @swagger
 * /auth/resetpassword/{resetToken}:
 *   put:
 *     summary: Reset password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Bad request
 */
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;
