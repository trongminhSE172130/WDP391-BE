const mongoose = require("mongoose");

const ConsultantBookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  consultant_schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ConsultantSchedule",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  question: {
    type: String,
    required: [true, "Please provide a question or reason for consultation"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ConsultantBooking", ConsultantBookingSchema);
