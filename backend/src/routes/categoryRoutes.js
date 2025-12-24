const express = require("express");
const {
  create,
  getAll,
  update,
  remove,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", create);
router.get("/", getAll);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
