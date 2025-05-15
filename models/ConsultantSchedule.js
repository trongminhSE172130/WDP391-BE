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
});

module.exports = mongoose.model("ConsultantSchedule", ConsultantScheduleSchema);
