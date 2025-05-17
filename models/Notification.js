const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "ovulation",
      "pill_reminder",
      "fertility_window",
      "booking",
      "booking_confirmed",
      "booking_cancelled",
    ],
    required: true,
  },
  message: {
    type: String,
    required: [true, "Please add a notification message"],
  },
  send_at: {
    type: Date,
    required: [true, "Please add a send date"],
  },
  is_sent: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
