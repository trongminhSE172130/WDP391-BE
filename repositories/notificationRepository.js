const Notification = require("../models/Notification");

class NotificationRepository {
  async create(notificationData) {
    return await Notification.create(notificationData);
  }

  async bulkCreate(notificationsArray) {
    return await Notification.insertMany(notificationsArray);
  }

  async findById(id) {
    return await Notification.findById(id);
  }

  async findByUserId(userId, options = {}) {
    const query = { user_id: userId };

    // Add pagination
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    return await Notification.find(query)
      .sort({ send_at: -1 })
      .skip(skip)
      .limit(limit);
  }

  async findPendingNotifications() {
    const now = new Date();
    return await Notification.find({
      send_at: { $lte: now },
      is_sent: false,
    }).populate("user_id", "fullName email");
  }

  async markAsSent(id) {
    return await Notification.findByIdAndUpdate(
      id,
      { is_sent: true },
      { new: true }
    );
  }

  async delete(id) {
    return await Notification.findByIdAndDelete(id);
  }
}

module.exports = new NotificationRepository();
