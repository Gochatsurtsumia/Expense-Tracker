const express = require("express");
const { register, login } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

module.exports = router;
