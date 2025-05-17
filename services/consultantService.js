const consultantRepository = require("../repositories/consultantRepository");

class ConsultantService {
  async getAllConsultants() {
    return await consultantRepository.findAll();
  }

  async getConsultantById(id) {
    return await consultantRepository.findById(id);
  }

  async createConsultant(consultantData) {
    return await consultantRepository.create(consultantData);
  }

  async updateConsultant(id, updateData) {
    return await consultantRepository.update(id, updateData);
  }

  async deleteConsultant(id) {
    return await consultantRepository.delete(id);
  }
}

module.exports = new ConsultantService();
