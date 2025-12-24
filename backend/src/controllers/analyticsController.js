const {
  getSummary,
  getByCategory,
  getMonthlyTrend,
} = require("../services/analyticsService");
const summary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const data = await getSummary(req.user.id, startDate, endDate);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const byCategory = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    const data = await getByCategory(req.user.id, type, startDate, endDate);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const monthlyTrend = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;

    const data = await getMonthlyTrend(req.user.id, months);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { summary, byCategory, monthlyTrend };
