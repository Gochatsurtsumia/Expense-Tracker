const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [30, "Category name cannot exceed 30 characters"],
    },
    type: {
      type: String,
      enum: {
        values: ["income", "expense", "both"],
        message: "Type must be income, expense, or both",
      },
      required: [true, "Category type is required"],
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
