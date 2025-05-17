const consultantScheduleRepository = require("../repositories/consultantScheduleRepository");

class ConsultantScheduleService {
  async getAllSchedules() {
    return await consultantScheduleRepository.findAll();
  }

  async getScheduleById(id) {
    return await consultantScheduleRepository.findById(id);
  }

  async getSchedulesByConsultantId(consultantId) {
    return await consultantScheduleRepository.findByConsultantId(consultantId);
  }

  async getAvailableSchedulesByConsultantId(consultantId) {
    return await consultantScheduleRepository.findAvailableByConsultantId(
      consultantId
    );
  }

  async getAvailableSchedulesByDate(date) {
    return await consultantScheduleRepository.findAvailableByDate(date);
  }

  async createSchedule(scheduleData) {
    return await consultantScheduleRepository.create(scheduleData);
  }

  async createBulkSchedules(schedulesArray) {
    return await consultantScheduleRepository.bulkCreate(schedulesArray);
  }

  async updateSchedule(id, updateData) {
    return await consultantScheduleRepository.update(id, updateData);
  }

  async deleteSchedule(id) {
    return await consultantScheduleRepository.delete(id);
  }

  async getAvailableTimeSlots(consultantId, date) {
    return await consultantScheduleRepository.findAvailableTimeSlots(
      consultantId,
      date
    );
  }

  async markScheduleAsBooked(id) {
    return await consultantScheduleRepository.markAsBooked(id);
  }

  async markScheduleAsAvailable(id) {
    return await consultantScheduleRepository.markAsAvailable(id);
  }
}

module.exports = new ConsultantScheduleService();
