const mongoose = require("mongoose");

const STITestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  dateRequested: {
    type: Date,
    default: Date.now,
  },
  appointmentDate: {
    type: Date,
    required: [true, "Please add an appointment date"],
  },
  status: {
    type: String,
    enum: [
      "requested",
      "sample collected",
      "processing",
      "completed",
      "cancelled",
    ],
    default: "requested",
  },
  sampleCollectionMethod: {
    type: String,
    enum: ["blood", "urine", "swab", "other"],
    required: true,
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  resultDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  isResultShared: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("STITest", STITestSchema);
