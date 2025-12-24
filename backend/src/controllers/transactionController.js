const {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../services/transactionService");

const create = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide amount, type, and category",
      });
    }

    const transaction = await createTransaction(req.user.id, {
      amount,
      type,
      category,
      date,
      description,
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const transactions = await getUserTransactions(req.user.id, {
      type,
      category,
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    const statusCode = error.message.includes("Not authorized") ? 403 : 404;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;

    const transaction = await updateTransaction(req.params.id, req.user.id, {
      amount,
      type,
      category,
      date,
      description,
    });

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    const statusCode = error.message.includes("Not authorized") ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteTransaction(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const statusCode = error.message.includes("Not authorized") ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { create, getAll, getOne, update, remove };
