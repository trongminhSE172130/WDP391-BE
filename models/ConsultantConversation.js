const mongoose = require("mongoose");

const ConsultantConversationSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ConsultantBooking",
    required: true,
  },
  sender: {
    type: String,
    enum: ["user", "consultant"],
    required: true,
  },
  message: {
    type: String,
    required: [true, "Please add a message"],
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "ConsultantConversation",
  ConsultantConversationSchema
);
