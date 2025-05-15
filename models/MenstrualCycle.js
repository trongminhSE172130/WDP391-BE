const mongoose = require("mongoose");

const MenstrualCycleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: [true, "Please add a start date"],
  },
  endDate: {
    type: Date,
  },
  cycleLength: {
    type: Number,
    default: 28,
  },
  periodLength: {
    type: Number,
    default: 5,
  },
  symptoms: [
    {
      type: String,
      enum: [
        "cramps",
        "headache",
        "bloating",
        "fatigue",
        "mood swings",
        "other",
      ],
    },
  ],
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate ovulation date (approximately 14 days before the next period)
MenstrualCycleSchema.methods.getOvulationDate = function () {
  const startDate = new Date(this.startDate);
  const ovulationDate = new Date(startDate);
  ovulationDate.setDate(startDate.getDate() + this.cycleLength - 14);
  return ovulationDate;
};

// Calculate fertility window (5 days before and 1 day after ovulation)
MenstrualCycleSchema.methods.getFertilityWindow = function () {
  const ovulationDate = this.getOvulationDate();

  const fertilityStart = new Date(ovulationDate);
  fertilityStart.setDate(ovulationDate.getDate() - 5);

  const fertilityEnd = new Date(ovulationDate);
  fertilityEnd.setDate(ovulationDate.getDate() + 1);

  return {
    start: fertilityStart,
    end: fertilityEnd,
  };
};

// Calculate next period date
MenstrualCycleSchema.methods.getNextPeriodDate = function () {
  const startDate = new Date(this.startDate);
  const nextPeriodDate = new Date(startDate);
  nextPeriodDate.setDate(startDate.getDate() + this.cycleLength);
  return nextPeriodDate;
};

module.exports = mongoose.model("MenstrualCycle", MenstrualCycleSchema);
