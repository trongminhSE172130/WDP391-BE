const FemaleReproductiveTracking = require("../models/FemaleReproductiveTracking");

class FemaleReproductiveTrackingRepository {
  async create(trackingData) {
    return await FemaleReproductiveTracking.create(trackingData);
  }

  async findById(id) {
    return await FemaleReproductiveTracking.findById(id);
  }

  async findByUserId(userId, options = {}) {
    const query = { user_id: userId };

    // Add pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    return await FemaleReproductiveTracking.find(query)
      .sort({ cycle_start_date: -1 })
      .skip(skip)
      .limit(limit);
  }

  async findLatestByUserId(userId) {
    return await FemaleReproductiveTracking.findOne({ user_id: userId }).sort({
      cycle_start_date: -1,
    });
  }

  async update(id, updateData) {
    return await FemaleReproductiveTracking.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await FemaleReproductiveTracking.findByIdAndDelete(id);
  }

  async addSymptom(trackingId, symptomData) {
    return await FemaleReproductiveTracking.findByIdAndUpdate(
      trackingId,
      { $push: { symptoms: symptomData } },
      { new: true, runValidators: true }
    );
  }

  async removeSymptom(trackingId, symptomId) {
    return await FemaleReproductiveTracking.findByIdAndUpdate(
      trackingId,
      { $pull: { symptoms: { _id: symptomId } } },
      { new: true }
    );
  }

  async getUsersWithUpcomingOvulation(daysAhead = 2) {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysAhead);

    return await FemaleReproductiveTracking.find({
      ovulation_day: {
        $gte: today,
        $lte: targetDate,
      },
    }).populate("user_id", "full_name email");
  }

  async getUsersWithUpcomingPeriod(daysAhead = 2) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysAhead);

    // Find records where next period would fall in our window
    // This is more complex and needs calculation based on the cycle_start_date and cycle_length
    const records = await FemaleReproductiveTracking.find({}).populate(
      "user_id",
      "full_name email"
    );

    return records.filter((record) => {
      const nextPeriod = record.getNextPeriodDate();
      return nextPeriod >= today && nextPeriod <= futureDate;
    });
  }

  async getUsersWithPillReminders() {
    return await FemaleReproductiveTracking.find({
      remind_pill: true,
    }).populate("user_id", "full_name email");
  }
}

module.exports = new FemaleReproductiveTrackingRepository();
