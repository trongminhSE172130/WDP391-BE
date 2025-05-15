const mongoose = require("mongoose");

const BookingResultSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  result: {
    type: String,
    enum: ["positive", "negative", "inconclusive"],
    required: true,
  },
  result_date: {
    type: Date,
    required: true,
  },
  doctor_note: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BookingResult", BookingResultSchema);
