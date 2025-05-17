const consultantBookingRepository = require("../repositories/consultantBookingRepository");
const consultantScheduleRepository = require("../repositories/consultantScheduleRepository");
const consultantScheduleService = require("./consultantScheduleService");
const notificationRepository = require("../repositories/notificationRepository");

class ConsultantBookingService {
  async getAllBookings() {
    return await consultantBookingRepository.findAll();
  }

  async getBookingById(id) {
    return await consultantBookingRepository.findById(id);
  }

  async getUserBookings(userId) {
    return await consultantBookingRepository.findByUserId(userId);
  }

  async getConsultantBookings(consultantId) {
    return await consultantBookingRepository.findByConsultantId(consultantId);
  }

  async getPendingBookings(consultantId) {
    return await consultantBookingRepository.findPendingBookings(consultantId);
  }

  async createBooking(bookingData) {
    // First mark the schedule as booked
    await consultantScheduleService.markScheduleAsBooked(
      bookingData.consultant_schedule_id
    );

    // Then create the booking
    const booking = await consultantBookingRepository.create(bookingData);

    // Create notification for the consultant
    const schedule = await consultantScheduleRepository.findById(
      bookingData.consultant_schedule_id
    );

    // Get consultant ID from schedule
    const consultantId = schedule.consultant_id;

    // Prepare notification data
    const currentDate = new Date();

    // Create booking notification
    await notificationRepository.create({
      user_id: bookingData.user_id,
      type: "booking",
      message:
        "You have successfully booked a consultation. Waiting for confirmation.",
      send_at: currentDate,
      is_sent: false,
    });

    return booking;
  }

  async updateBooking(id, updateData) {
    return await consultantBookingRepository.update(id, updateData);
  }

  async confirmBooking(id, meetingLink) {
    // Update booking status to confirmed
    const booking = await consultantBookingRepository.update(id, {
      status: "confirmed",
      meeting_link: meetingLink,
    });

    // Create notification for the user
    const currentDate = new Date();

    await notificationRepository.create({
      user_id: booking.user_id,
      type: "booking_confirmed",
      message:
        "Your consultation booking has been confirmed. You can join the meeting through the provided link.",
      send_at: currentDate,
      is_sent: false,
    });

    return booking;
  }

  async cancelBooking(id, reason) {
    const booking = await consultantBookingRepository.findById(id);

    // Mark schedule as available again
    await consultantScheduleService.markScheduleAsAvailable(
      booking.consultant_schedule_id
    );

    // Update booking status to cancelled
    const cancelledBooking = await consultantBookingRepository.update(id, {
      status: "cancelled",
    });

    // Create notification for the user
    const currentDate = new Date();

    await notificationRepository.create({
      user_id: booking.user_id,
      type: "booking_cancelled",
      message: `Your consultation booking has been cancelled. Reason: ${
        reason || "Not specified."
      }`,
      send_at: currentDate,
      is_sent: false,
    });

    return cancelledBooking;
  }

  async completeBooking(id) {
    return await consultantBookingRepository.updateStatus(id, "completed");
  }

  async deleteBooking(id) {
    const booking = await consultantBookingRepository.findById(id);

    // Mark schedule as available again if booking is not completed
    if (booking.status !== "completed") {
      await consultantScheduleService.markScheduleAsAvailable(
        booking.consultant_schedule_id
      );
    }

    return await consultantBookingRepository.delete(id);
  }
}

module.exports = new ConsultantBookingService();
