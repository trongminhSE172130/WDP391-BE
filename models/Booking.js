const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  scheduled_date: {
    type: Date,
    required: [true, "Please add a scheduled date"],
  },
  status: {
    type: String,
    enum: [
      "pending",
      "sample_collected",
      "processing",
      "completed",
      "cancelled",
    ],
    default: "pending",
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
BookingSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Booking", BookingSchema);
