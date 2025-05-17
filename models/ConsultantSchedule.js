const mongoose = require("mongoose");

const ConsultantScheduleSchema = new mongoose.Schema({
  consultant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultant",
    required: true,
  },
  date: {
    type: Date,
    required: [true, "Please add a date"],
  },
  time_slot: {
    type: String,
    required: [true, "Please add a time slot"],
  },
  is_booked: {
    type: Boolean,
    default: false,
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
ConsultantScheduleSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("ConsultantSchedule", ConsultantScheduleSchema);
