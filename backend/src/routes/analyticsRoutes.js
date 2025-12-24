const express = require("express");
const {
  summary,
  byCategory,
  monthlyTrend,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const router = express.Router();
router.use(protect);
router.get("/summary", summary);
router.get("/by-category", byCategory);
router.get("/monthly-trend", monthlyTrend);

module.exports = router;
