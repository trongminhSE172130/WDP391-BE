const notificationService = require("../services/notificationService");

exports.getUserNotifications = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };

    const notifications = await notificationService.getUserNotifications(
      req.user.id,
      options
    );

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};

exports.processPendingNotifications = async (req, res, next) => {
  try {
    // This endpoint should be protected and only accessible by admin/system
    const count = await notificationService.processPendingNotifications();

    res.status(200).json({
      success: true,
      count,
      message: `${count} notifications processed`,
    });
  } catch (err) {
    next(err);
  }
};
