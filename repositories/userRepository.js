const User = require("../models/User");

class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, updates) {
    return await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async findAll(query = {}) {
    return await User.find(query);
  }

  async findByIdWithPassword(id) {
    return await User.findById(id).select("+password");
  }

  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select("+password");
  }
}

module.exports = new UserRepository();
