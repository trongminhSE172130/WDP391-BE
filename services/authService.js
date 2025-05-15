const userRepository = require("../repositories/userRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

class AuthService {
  async register(userData) {
    // Check if user already exists
    const userExists = await userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new Error("User already exists");
    }

    // Create user
    const user = await userRepository.create(userData);

    return {
      user,
      token: this.generateToken(user._id),
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return {
      user,
      token: this.generateToken(user._id),
    };
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  async getMe(userId) {
    return await userRepository.findById(userId);
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findByIdWithPassword(userId);

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return {
      success: true,
      message: "Password updated successfully",
    };
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("No user with that email");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    return resetToken;
  }

  async resetPassword(resetToken, newPassword) {
    // Hash token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid token");
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return {
      success: true,
      message: "Password reset successful",
    };
  }
}

module.exports = new AuthService();
