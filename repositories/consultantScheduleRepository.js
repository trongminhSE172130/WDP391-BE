const ConsultantSchedule = require("../models/ConsultantSchedule");

class ConsultantScheduleRepository {
  async findAll(query = {}) {
    return await ConsultantSchedule.find(query);
  }

  async findById(id) {
    return await ConsultantSchedule.findById(id);
  }

  async findByConsultantId(consultantId) {
    return await ConsultantSchedule.find({ consultant_id: consultantId });
  }

  async findAvailableByConsultantId(consultantId) {
    return await ConsultantSchedule.find({
      consultant_id: consultantId,
      is_booked: false,
      date: { $gte: new Date() },
    }).sort({ date: 1 });
  }

  async findAvailableByDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await ConsultantSchedule.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      is_booked: false,
    }).populate("consultant_id");
  }

  async create(scheduleData) {
    return await ConsultantSchedule.create(scheduleData);
  }

  async bulkCreate(schedulesArray) {
    return await ConsultantSchedule.insertMany(schedulesArray);
  }

  async update(id, updates) {
    return await ConsultantSchedule.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await ConsultantSchedule.findByIdAndDelete(id);
  }

  async findAvailableTimeSlots(consultantId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await ConsultantSchedule.find({
      consultant_id: consultantId,
      date: { $gte: startOfDay, $lte: endOfDay },
      is_booked: false,
    }).sort({ time_slot: 1 });
  }

  async markAsBooked(id) {
    return await ConsultantSchedule.findByIdAndUpdate(
      id,
      { is_booked: true },
      { new: true }
    );
  }

  async markAsAvailable(id) {
    return await ConsultantSchedule.findByIdAndUpdate(
      id,
      { is_booked: false },
      { new: true }
    );
  }
}

module.exports = new ConsultantScheduleRepository();
