const femaleReproductiveTrackingService = require("../services/femaleReproductiveTrackingService");

exports.createCycle = async (req, res, next) => {
  try {
    const {
      cycle_start_date,
      cycle_length,
      period_length,
      notes,
      remind_pill,
      pill_time,
      pill_start_date,
    } = req.body;

    const cycleData = {
      user_id: req.user.id,
      cycle_start_date,
      cycle_length: cycle_length || 28,
      period_length: period_length || 5,
      notes,
      remind_pill: remind_pill || false,
      pill_time,
      pill_start_date,
    };

    const cycle = await femaleReproductiveTrackingService.createCycle(
      cycleData
    );

    res.status(201).json({
      success: true,
      data: cycle,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserCycles = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };

    const cycles = await femaleReproductiveTrackingService.getUserCycles(
      req.user.id,
      options
    );

    res.status(200).json({
      success: true,
      count: cycles.length,
      data: cycles,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentCycle = async (req, res, next) => {
  try {
    const cycle = await femaleReproductiveTrackingService.getUserLatestCycle(
      req.user.id
    );

    if (!cycle) {
      return res.status(404).json({
        success: false,
        error: "No cycle data found",
      });
    }

    res.status(200).json({
      success: true,
      data: cycle,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCycle = async (req, res, next) => {
  try {
    const { cycleId } = req.params;
    const {
      cycle_start_date,
      cycle_length,
      period_length,
      notes,
      remind_pill,
      pill_time,
      pill_start_date,
    } = req.body;

    // Make sure user owns the cycle
    const cycle = await femaleReproductiveTrackingService.getUserCycles(
      req.user.id
    );
    const userCycle = cycle.find((c) => c._id.toString() === cycleId);

    if (!userCycle) {
      return res.status(404).json({
        success: false,
        error: "Cycle not found or not authorized",
      });
    }

    const updateData = {
      ...(cycle_start_date && { cycle_start_date }),
      ...(cycle_length && { cycle_length }),
      ...(period_length && { period_length }),
      ...(notes !== undefined && { notes }),
      ...(remind_pill !== undefined && { remind_pill }),
      ...(pill_time && { pill_time }),
      ...(pill_start_date && { pill_start_date }),
    };

    const updatedCycle = await femaleReproductiveTrackingService.updateCycle(
      cycleId,
      updateData
    );

    res.status(200).json({
      success: true,
      data: updatedCycle,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCycle = async (req, res, next) => {
  try {
    const { cycleId } = req.params;

    // Make sure user owns the cycle
    const cycle = await femaleReproductiveTrackingService.getUserCycles(
      req.user.id
    );
    const userCycle = cycle.find((c) => c._id.toString() === cycleId);

    if (!userCycle) {
      return res.status(404).json({
        success: false,
        error: "Cycle not found or not authorized",
      });
    }

    await femaleReproductiveTrackingService.deleteCycle(cycleId);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

exports.addSymptom = async (req, res, next) => {
  try {
    const { cycleId } = req.params;
    const { date, type, severity, notes } = req.body;

    // Make sure user owns the cycle
    const cycle = await femaleReproductiveTrackingService.getUserCycles(
      req.user.id
    );
    const userCycle = cycle.find((c) => c._id.toString() === cycleId);

    if (!userCycle) {
      return res.status(404).json({
        success: false,
        error: "Cycle not found or not authorized",
      });
    }

    const symptomData = {
      date,
      type,
      severity,
      notes,
    };

    const updatedCycle = await femaleReproductiveTrackingService.addSymptom(
      cycleId,
      symptomData
    );

    res.status(200).json({
      success: true,
      data: updatedCycle,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeSymptom = async (req, res, next) => {
  try {
    const { cycleId, symptomId } = req.params;

    // Make sure user owns the cycle
    const cycle = await femaleReproductiveTrackingService.getUserCycles(
      req.user.id
    );
    const userCycle = cycle.find((c) => c._id.toString() === cycleId);

    if (!userCycle) {
      return res.status(404).json({
        success: false,
        error: "Cycle not found or not authorized",
      });
    }

    const updatedCycle = await femaleReproductiveTrackingService.removeSymptom(
      cycleId,
      symptomId
    );

    res.status(200).json({
      success: true,
      data: updatedCycle,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFertilityStatus = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();

    const fertilityStatus =
      await femaleReproductiveTrackingService.getFertilityStatusForDate(
        req.user.id,
        date
      );

    res.status(200).json({
      success: true,
      data: fertilityStatus,
    });
  } catch (err) {
    next(err);
  }
};

exports.getNextPeriodPrediction = async (req, res, next) => {
  try {
    const prediction =
      await femaleReproductiveTrackingService.getNextPeriodPrediction(
        req.user.id
      );

    if (!prediction) {
      return res.status(404).json({
        success: false,
        error: "No cycle data found to make predictions",
      });
    }

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (err) {
    next(err);
  }
};
