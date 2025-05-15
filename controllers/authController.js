const authService = require("../services/authService");
const nodemailer = require("nodemailer");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      dob,
      phone,
      role: role || "user", // Default to user if no role specified
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
        token: result.token,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
        token: result.token,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await authService.updatePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const resetToken = await authService.forgotPassword(email);

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetpassword/${resetToken}`;

    // Create email message
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      // Setup email
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Password Reset Token",
        text: message,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: "Email sent",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Email could not be sent",
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const result = await authService.resetPassword(resetToken, password);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    next(err);
  }
};
