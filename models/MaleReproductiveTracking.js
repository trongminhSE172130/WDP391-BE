const mongoose = require("mongoose");

const MaleReproductiveTrackingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  semen_analysis_date: {
    type: Date,
    required: [true, "Please add a semen analysis date"],
  },
  semen_volume: {
    type: Number,
  },
  sperm_count: {
    type: Number,
  },
  sperm_motility: {
    type: String,
  },
  sperm_morphology: {
    type: String,
  },
  testosterone_level: {
    type: Number,
  },
  notes: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "MaleReproductiveTracking",
  MaleReproductiveTrackingSchema
);
