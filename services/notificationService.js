const notificationRepository = require("../repositories/notificationRepository");

class NotificationService {
  async getUserNotifications(userId, options) {
    return await notificationRepository.findByUserId(userId, options);
  }

  async markAsSent(notificationId) {
    return await notificationRepository.markAsSent(notificationId);
  }

  async processPendingNotifications() {
    const pendingNotifications =
      await notificationRepository.findPendingNotifications();

    // Here you would typically integrate with a notification service
    // like Firebase Cloud Messaging, email service, or SMS service
    for (const notification of pendingNotifications) {
      try {
        // In a real application, you would send the notification here
        console.log(
          `Sending notification to ${notification.user_id.email}: ${notification.message}`
        );

        // Mark as sent
        await this.markAsSent(notification._id);
      } catch (error) {
        console.error(
          `Failed to send notification ${notification._id}:`,
          error
        );
      }
    }

    return pendingNotifications.length;
  }
}

module.exports = new NotificationService();
