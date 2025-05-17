const consultantBookingService = require("../services/consultantBookingService");

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await consultantBookingService.getAllBookings();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await consultantBookingService.getBookingById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await consultantBookingService.getUserBookings(
      req.user.id
    );

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

exports.getConsultantBookings = async (req, res, next) => {
  try {
    const consultantId = req.params.consultantId;
    const bookings = await consultantBookingService.getConsultantBookings(
      consultantId
    );

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPendingBookings = async (req, res, next) => {
  try {
    const consultantId = req.params.consultantId;
    const bookings = await consultantBookingService.getPendingBookings(
      consultantId
    );

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const { consultant_schedule_id, question } = req.body;

    // Validate required fields
    if (!consultant_schedule_id || !question) {
      return res.status(400).json({
        success: false,
        error: "Please provide consultant_schedule_id and question",
      });
    }

    const booking = await consultantBookingService.createBooking({
      user_id: req.user.id,
      consultant_schedule_id,
      question,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.confirmBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { meeting_link } = req.body;

    if (!meeting_link) {
      return res.status(400).json({
        success: false,
        error: "Please provide a meeting link",
      });
    }

    const booking = await consultantBookingService.confirmBooking(
      id,
      meeting_link
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await consultantBookingService.cancelBooking(id, reason);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.completeBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await consultantBookingService.completeBooking(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await consultantBookingService.deleteBooking(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
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
