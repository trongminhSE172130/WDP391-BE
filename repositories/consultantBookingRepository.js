const ConsultantBooking = require("../models/ConsultantBooking");

class ConsultantBookingRepository {
  async findAll(query = {}) {
    return await ConsultantBooking.find(query);
  }

  async findById(id) {
    return await ConsultantBooking.findById(id)
      .populate("user_id", "fullName email phone")
      .populate({
        path: "consultant_schedule_id",
        populate: {
          path: "consultant_id",
          model: "Consultant",
        },
      });
  }

  async findByUserId(userId) {
    return await ConsultantBooking.find({ user_id: userId })
      .populate({
        path: "consultant_schedule_id",
        populate: {
          path: "consultant_id",
          model: "Consultant",
        },
      })
      .sort({ created_at: -1 });
  }

  async findByConsultantId(consultantId) {
    return await ConsultantBooking.find({
      "consultant_schedule_id.consultant_id": consultantId,
    })
      .populate("user_id", "fullName email phone")
      .populate("consultant_schedule_id")
      .sort({ created_at: -1 });
  }

  async findPendingBookings(consultantId) {
    return await ConsultantBooking.find({
      status: "pending",
      "consultant_schedule_id.consultant_id": consultantId,
    })
      .populate("user_id", "fullName email phone")
      .populate("consultant_schedule_id")
      .sort({ created_at: -1 });
  }

  async create(bookingData) {
    return await ConsultantBooking.create(bookingData);
  }

  async update(id, updates) {
    return await ConsultantBooking.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
  }

  async updateStatus(id, status) {
    return await ConsultantBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

  async delete(id) {
    return await ConsultantBooking.findByIdAndDelete(id);
  }
}

module.exports = new ConsultantBookingRepository();
