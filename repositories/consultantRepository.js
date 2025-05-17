const Consultant = require("../models/Consultant");

class ConsultantRepository {
  async findAll(query = {}) {
    return await Consultant.find(query);
  }

  async findById(id) {
    return await Consultant.findById(id);
  }

  async create(consultantData) {
    return await Consultant.create(consultantData);
  }

  async update(id, updates) {
    return await Consultant.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Consultant.findByIdAndDelete(id);
  }
}

module.exports = new ConsultantRepository();
