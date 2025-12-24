const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

const createTransaction = async (userId, data) => {
  const { amount, type, category, date, description } = data;
  const categoryDoc = await Category.findById(category);

  if (!categoryDoc) {
    throw new Error("Category not found");
  }

  if (categoryDoc.user.toString() !== userId) {
    throw new Error("Not authorized to use this category");
  }

  if (categoryDoc.type !== "both" && categoryDoc.type !== type) {
    throw new Error(
      `Category "${categoryDoc.name}" can only be used for ${categoryDoc.type} transactions`
    );
  }

  const transaction = await Transaction.create({
    user: userId,
    amount,
    type,
    category,
    date: date || Date.now(),
    description,
  });

  await transaction.populate("category", "name type");

  return transaction;
};

const getUserTransactions = async (userId, filters = {}) => {
  const query = { user: userId };

  // Apply filters
  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }

  const transactions = await Transaction.find(query)
    .populate("category", "name type")
    .sort({ date: -1 });

  return transactions;
};

const getTransactionById = async (transactionId, userId) => {
  const transaction = await Transaction.findById(transactionId).populate(
    "category",
    "name type"
  );

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (transaction.user.toString() !== userId) {
    throw new Error("Not authorized to access this transaction");
  }

  return transaction;
};

const updateTransaction = async (transactionId, userId, updates) => {
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (transaction.user.toString() !== userId) {
    throw new Error("Not authorized to update this transaction");
  }

  if (updates.category) {
    const categoryDoc = await Category.findById(updates.category);

    if (!categoryDoc) {
      throw new Error("Category not found");
    }

    if (categoryDoc.user.toString() !== userId) {
      throw new Error("Not authorized to use this category");
    }

    const transactionType = updates.type || transaction.type;
    if (categoryDoc.type !== "both" && categoryDoc.type !== transactionType) {
      throw new Error(
        `Category "${categoryDoc.name}" can only be used for ${categoryDoc.type} transactions`
      );
    }
  }

  if (updates.amount !== undefined) transaction.amount = updates.amount;
  if (updates.type) transaction.type = updates.type;
  if (updates.category) transaction.category = updates.category;
  if (updates.date) transaction.date = updates.date;
  if (updates.description !== undefined)
    transaction.description = updates.description;

  await transaction.save();
  await transaction.populate("category", "name type");

  return transaction;
};

const deleteTransaction = async (transactionId, userId) => {
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (transaction.user.toString() !== userId) {
    throw new Error("Not authorized to delete this transaction");
  }

  await transaction.deleteOne();
  return { message: "Transaction deleted successfully" };
};

module.exports = {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
