const consultantScheduleService = require("../services/consultantScheduleService");

exports.getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await consultantScheduleService.getAllSchedules();

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSchedulesByConsultant = async (req, res, next) => {
  try {
    const consultantId = req.params.consultantId;
    const schedules =
      await consultantScheduleService.getSchedulesByConsultantId(consultantId);

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAvailableSchedulesByConsultant = async (req, res, next) => {
  try {
    const consultantId = req.params.consultantId;
    const schedules =
      await consultantScheduleService.getAvailableSchedulesByConsultantId(
        consultantId
      );

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAvailableSchedulesByDate = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const schedules =
      await consultantScheduleService.getAvailableSchedulesByDate(date);

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (err) {
    next(err);
  }
};

exports.createSchedule = async (req, res, next) => {
  try {
    const { consultant_id, date, time_slot } = req.body;

    // Validate required fields
    if (!consultant_id || !date || !time_slot) {
      return res.status(400).json({
        success: false,
        error: "Please provide consultant_id, date, and time_slot",
      });
    }

    const schedule = await consultantScheduleService.createSchedule({
      consultant_id,
      date,
      time_slot,
      is_booked: false,
    });

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
};

exports.createBulkSchedules = async (req, res, next) => {
  try {
    const { schedules } = req.body;

    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide an array of schedules",
      });
    }

    const createdSchedules =
      await consultantScheduleService.createBulkSchedules(schedules);

    res.status(201).json({
      success: true,
      count: createdSchedules.length,
      data: createdSchedules,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const { consultant_id, date, time_slot, is_booked } = req.body;
    const schedule = await consultantScheduleService.updateSchedule(
      req.params.id,
      {
        consultant_id,
        date,
        time_slot,
        is_booked,
      }
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: "Schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await consultantScheduleService.deleteSchedule(
      req.params.id
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: "Schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

exports.getAvailableTimeSlots = async (req, res, next) => {
  try {
    const { consultantId, date } = req.query;

    if (!consultantId || !date) {
      return res.status(400).json({
        success: false,
        error: "Please provide consultantId and date",
      });
    }

    const timeSlots = await consultantScheduleService.getAvailableTimeSlots(
      consultantId,
      date
    );

    res.status(200).json({
      success: true,
      count: timeSlots.length,
      data: timeSlots,
    });
  } catch (err) {
    next(err);
  }
};
