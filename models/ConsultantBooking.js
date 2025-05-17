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
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  question: {
    type: String,
    required: [true, "Please provide a question or reason for consultation"],
  },
  meeting_link: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the updated_at field before saving
ConsultantBookingSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("ConsultantBooking", ConsultantBookingSchema);
