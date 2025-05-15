const femaleReproductiveTrackingRepository = require("../repositories/femaleReproductiveTrackingRepository");
const notificationRepository = require("../repositories/notificationRepository");

class FemaleReproductiveTrackingService {
  async createCycle(userData) {
    const cycle = await femaleReproductiveTrackingRepository.create(userData);

    // Create notifications if needed
    if (cycle) {
      await this.generateNotifications(cycle);
    }

    return cycle;
  }

  async getUserCycles(userId, options) {
    return await femaleReproductiveTrackingRepository.findByUserId(
      userId,
      options
    );
  }

  async getUserLatestCycle(userId) {
    return await femaleReproductiveTrackingRepository.findLatestByUserId(
      userId
    );
  }

  async updateCycle(cycleId, updateData) {
    const updatedCycle = await femaleReproductiveTrackingRepository.update(
      cycleId,
      updateData
    );

    // Re-generate notifications if needed
    if (updatedCycle) {
      // Delete existing notifications (that haven't been sent yet)
      const pendingNotifications = await notificationRepository.findByUserId(
        updatedCycle.user_id
      );
      for (const notification of pendingNotifications) {
        if (!notification.is_sent) {
          await notificationRepository.delete(notification._id);
        }
      }

      // Generate new notifications
      await this.generateNotifications(updatedCycle);
    }

    return updatedCycle;
  }

  async deleteCycle(cycleId) {
    return await femaleReproductiveTrackingRepository.delete(cycleId);
  }

  async addSymptom(cycleId, symptomData) {
    return await femaleReproductiveTrackingRepository.addSymptom(
      cycleId,
      symptomData
    );
  }

  async removeSymptom(cycleId, symptomId) {
    return await femaleReproductiveTrackingRepository.removeSymptom(
      cycleId,
      symptomId
    );
  }

  async getFertilityStatusForDate(userId, date) {
    const latestCycle =
      await femaleReproductiveTrackingRepository.findLatestByUserId(userId);
    if (!latestCycle) {
      return { status: "unknown", message: "No cycle data available" };
    }

    const status = latestCycle.getFertilityStatus(date);
    let message = "";

    switch (status) {
      case "high":
        message = "High fertility period. Chance of pregnancy is high.";
        break;
      case "medium":
        message = "Medium fertility period. Still possible to get pregnant.";
        break;
      case "low":
        message = "Low fertility period. Less likely to get pregnant.";
        break;
      case "period":
        message = "You are on your period.";
        break;
      default:
        message = "Unable to determine fertility status.";
    }

    return { status, message };
  }

  async generateNotifications(cycle) {
    const notifications = [];

    // 1. Ovulation notification - 2 days before ovulation
    const ovulationDate = new Date(cycle.ovulation_day);
    const ovulationNotificationDate = new Date(ovulationDate);
    ovulationNotificationDate.setDate(ovulationDate.getDate() - 2);

    notifications.push({
      user_id: cycle.user_id,
      type: "ovulation",
      message:
        "Your ovulation day is coming up in 2 days. Fertility is high during this period.",
      send_at: ovulationNotificationDate,
      is_sent: false,
    });

    // 2. Fertility window notification - at the start of fertility window
    const fertilityStart = new Date(cycle.fertility_window.split(" to ")[0]);

    notifications.push({
      user_id: cycle.user_id,
      type: "fertility_window",
      message:
        "Your fertility window is starting today. Higher chance of pregnancy during this period.",
      send_at: fertilityStart,
      is_sent: false,
    });

    // 3. Pill reminder if enabled
    if (cycle.remind_pill && cycle.pill_time) {
      // Create daily pill reminders for the entire cycle
      const cycleStartDate = new Date(cycle.cycle_start_date);
      const nextPeriodDate = new Date(cycleStartDate);
      nextPeriodDate.setDate(cycleStartDate.getDate() + cycle.cycle_length);

      let currentDate = new Date(cycleStartDate);

      while (currentDate < nextPeriodDate) {
        // Set the reminder time
        const [hours, minutes] = cycle.pill_time.split(":");
        const reminderTime = new Date(currentDate);
        reminderTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        // Only create reminders for future dates
        if (reminderTime > new Date()) {
          notifications.push({
            user_id: cycle.user_id,
            type: "pill_reminder",
            message: "Reminder: Time to take your contraceptive pill.",
            send_at: reminderTime,
            is_sent: false,
          });
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Save notifications to database
    if (notifications.length > 0) {
      await notificationRepository.bulkCreate(notifications);
    }

    return notifications;
  }

  async getNextPeriodPrediction(userId) {
    const latestCycle =
      await femaleReproductiveTrackingRepository.findLatestByUserId(userId);
    if (!latestCycle) {
      return null;
    }

    const nextPeriodDate = latestCycle.getNextPeriodDate();

    const today = new Date();
    const daysUntilNextPeriod = Math.ceil(
      (nextPeriodDate - today) / (1000 * 60 * 60 * 24)
    );

    return {
      next_period_date: nextPeriodDate,
      days_until_next_period: daysUntilNextPeriod,
    };
  }
}

module.exports = new FemaleReproductiveTrackingService();
