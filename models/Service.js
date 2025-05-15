const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  duration: {
    type: String,
    required: [true, "Please add duration"],
  },
  sample_type: {
    type: String,
    required: [true, "Please add sample type"],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  image_url: {
    type: String,
    default: "no-photo.jpg",
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
ServiceSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Service", ServiceSchema);
