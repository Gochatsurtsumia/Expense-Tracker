const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      enum: {
        values: ["income", "expense"],
        message: "Type must be income or expense",
      },
      required: [true, "Transaction type is required"],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
