const mongoose = require("mongoose");

const FemaleReproductiveTrackingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cycle_start_date: {
    type: Date,
    required: [true, "Please add a cycle start date"],
  },
  cycle_length: {
    type: Number,
    required: [true, "Please add a cycle length"],
    default: 28,
  },
  period_length: {
    type: Number,
    default: 5,
  },
  ovulation_day: {
    type: Date,
  },
  fertility_window: {
    type: String,
  },
  notes: {
    type: String,
  },
  remind_pill: {
    type: Boolean,
    default: false,
  },
  pill_time: {
    type: String,
    // Time format: "HH:MM" in 24-hour format
  },
  pill_start_date: {
    type: Date,
  },
  symptoms: [
    {
      date: Date,
      type: {
        type: String,
        enum: [
          "cramps",
          "headache",
          "bloating",
          "mood_swings",
          "fatigue",
          "acne",
          "other",
        ],
      },
      severity: {
        type: Number,
        min: 1,
        max: 5,
      },
      notes: String,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Calculate ovulation day and fertility window before saving
FemaleReproductiveTrackingSchema.pre("save", function (next) {
  this.updated_at = Date.now();

  // Calculate ovulation day (typically 14 days before the next period)
  const cycleStartDate = new Date(this.cycle_start_date);
  const ovulationDate = new Date(cycleStartDate);
  ovulationDate.setDate(cycleStartDate.getDate() + this.cycle_length - 14);
  this.ovulation_day = ovulationDate;

  // Calculate fertility window (usually 5 days before and 1 day after ovulation)
  const fertilityStartDate = new Date(ovulationDate);
  fertilityStartDate.setDate(ovulationDate.getDate() - 5);

  const fertilityEndDate = new Date(ovulationDate);
  fertilityEndDate.setDate(ovulationDate.getDate() + 1);

  this.fertility_window = `${
    fertilityStartDate.toISOString().split("T")[0]
  } to ${fertilityEndDate.toISOString().split("T")[0]}`;

  next();
});

// Method to get next period date
FemaleReproductiveTrackingSchema.methods.getNextPeriodDate = function () {
  const cycleStartDate = new Date(this.cycle_start_date);
  const nextPeriodDate = new Date(cycleStartDate);
  nextPeriodDate.setDate(cycleStartDate.getDate() + this.cycle_length);
  return nextPeriodDate;
};

// Method to get fertility status for a specific date
FemaleReproductiveTrackingSchema.methods.getFertilityStatus = function (date) {
  const checkDate = new Date(date);
  const fertilityStart = new Date(this.fertility_window.split(" to ")[0]);
  const fertilityEnd = new Date(this.fertility_window.split(" to ")[1]);

  if (checkDate >= fertilityStart && checkDate <= fertilityEnd) {
    return "high";
  }

  // Define 'safe' period (usually after period ends and before fertility window starts)
  const periodEndDate = new Date(this.cycle_start_date);
  periodEndDate.setDate(periodEndDate.getDate() + this.period_length);

  if (checkDate > periodEndDate && checkDate < fertilityStart) {
    return "low";
  }

  // During period
  if (checkDate >= this.cycle_start_date && checkDate <= periodEndDate) {
    return "period";
  }

  return "medium";
};

module.exports = mongoose.model(
  "FemaleReproductiveTracking",
  FemaleReproductiveTrackingSchema
);
