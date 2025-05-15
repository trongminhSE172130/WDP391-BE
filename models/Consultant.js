const mongoose = require("mongoose");

const ConsultantSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, "Please add a full name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  degree: {
    type: String,
    required: [true, "Please add degree information"],
  },
  experience_years: {
    type: Number,
    required: [true, "Please add years of experience"],
  },
  bio: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Consultant", ConsultantSchema);
