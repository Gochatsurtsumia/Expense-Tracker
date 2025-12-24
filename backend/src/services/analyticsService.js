const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const getSummary = async (userId, startDate, endDate) => {
  const matchStage = { user: new mongoose.Types.ObjectId(userId) };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  const result = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = {
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    incomeCount: 0,
    expenseCount: 0,
    totalTransactions: 0,
  };

  result.forEach((item) => {
    if (item._id === "income") {
      summary.totalIncome = item.total;
      summary.incomeCount = item.count;
    } else if (item._id === "expense") {
      summary.totalExpense = item.total;
      summary.expenseCount = item.count;
    }
  });

  summary.netSavings = summary.totalIncome - summary.totalExpense;
  summary.totalTransactions = summary.incomeCount + summary.expenseCount;

  return summary;
};

const getByCategory = async (userId, type, startDate, endDate) => {
  const matchStage = { user: new mongoose.Types.ObjectId(userId) };

  if (type) {
    matchStage.type = type;
  }

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  const result = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: "$categoryInfo" },
    {
      $project: {
        category: "$categoryInfo.name",
        categoryType: "$categoryInfo.type",
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = result.reduce((sum, item) => sum + item.total, 0);

  const withPercentages = result.map((item) => ({
    category: item.category,
    categoryType: item.categoryType,
    total: item.total,
    count: item.count,
    percentage:
      grandTotal > 0 ? Math.round((item.total / grandTotal) * 100) : 0,
  }));

  return withPercentages;
};

const getMonthlyTrend = async (userId, months = 6) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Format result into monthly summaries
  const monthlyData = {};

  result.forEach((item) => {
    const monthKey = `${item._id.year}-${String(item._id.month).padStart(
      2,
      "0"
    )}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        income: 0,
        expense: 0,
        net: 0,
      };
    }

    if (item._id.type === "income") {
      monthlyData[monthKey].income = item.total;
    } else if (item._id.type === "expense") {
      monthlyData[monthKey].expense = item.total;
    }
  });

  const trend = Object.values(monthlyData).map((month) => ({
    ...month,
    net: month.income - month.expense,
  }));

  return trend;
};

module.exports = {
  getSummary,
  getByCategory,
  getMonthlyTrend,
};
