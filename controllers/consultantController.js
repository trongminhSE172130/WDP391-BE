const consultantService = require("../services/consultantService");

exports.getAllConsultants = async (req, res, next) => {
  try {
    const consultants = await consultantService.getAllConsultants();

    res.status(200).json({
      success: true,
      count: consultants.length,
      data: consultants,
    });
  } catch (err) {
    next(err);
  }
};

exports.getConsultantById = async (req, res, next) => {
  try {
    const consultant = await consultantService.getConsultantById(req.params.id);

    if (!consultant) {
      return res.status(404).json({
        success: false,
        error: "Consultant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: consultant,
    });
  } catch (err) {
    next(err);
  }
};

exports.createConsultant = async (req, res, next) => {
  try {
    const { full_name, email, degree, experience_years, bio } = req.body;

    // Validate required fields
    if (!full_name || !email || !degree) {
      return res.status(400).json({
        success: false,
        error: "Please provide full_name, email, and degree",
      });
    }

    const consultant = await consultantService.createConsultant({
      full_name,
      email,
      degree,
      experience_years,
      bio,
    });

    res.status(201).json({
      success: true,
      data: consultant,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateConsultant = async (req, res, next) => {
  try {
    const { full_name, email, degree, experience_years, bio } = req.body;
    const consultant = await consultantService.updateConsultant(req.params.id, {
      full_name,
      email,
      degree,
      experience_years,
      bio,
    });

    if (!consultant) {
      return res.status(404).json({
        success: false,
        error: "Consultant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: consultant,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteConsultant = async (req, res, next) => {
  try {
    const consultant = await consultantService.deleteConsultant(req.params.id);

    if (!consultant) {
      return res.status(404).json({
        success: false,
        error: "Consultant not found",
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
