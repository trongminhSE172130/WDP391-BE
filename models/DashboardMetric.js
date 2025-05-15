const mongoose = require("mongoose");

const DashboardMetricSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  total_users: {
    type: Number,
    required: true,
  },
  new_users: {
    type: Number,
    required: true,
  },
  total_bookings: {
    type: Number,
    required: true,
  },
  completed_bookings: {
    type: Number,
    required: true,
  },
  total_consultations: {
    type: Number,
    required: true,
  },
  average_rating: {
    type: Number,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DashboardMetric", DashboardMetricSchema);
