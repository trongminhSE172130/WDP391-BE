const notificationService = require("../services/notificationService");

class Scheduler {
  init() {
    // Process notifications every minute
    setInterval(async () => {
      try {
        const count = await notificationService.processPendingNotifications();
        if (count > 0) {
          console.log(`Processed ${count} notifications`);
        }
      } catch (error) {
        console.error("Error processing notifications:", error);
      }
    }, 60000); // 60000 ms = 1 minute
  }
}

module.exports = new Scheduler();
