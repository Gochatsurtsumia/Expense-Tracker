const express = require("express");
const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);
router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
