const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { date, category, type, amount } = req.body;
    const transaction = new Transaction({
      user: req.user.id,
      date,
      category,
      type,
      amount,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactionSummary = async (req, res) => {
  try {
    const filters = { user: req.user.id }; // assuming user ID in req.user
    const { startDate, endDate } = req.query;
    if (startDate && endDate)
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    const transactions = await Transaction.find(filters);
    const summary = transactions.reduce(
      (acc, t) => {
        const key = t.type === "income" ? "income" : "expenses";
        acc[`total${key[0].toUpperCase() + key.slice(1)}`] += t.amount;
        acc[`${key}ByCategory`][t.category] =
          (acc[`${key}ByCategory`][t.category] || 0) + t.amount;
        return acc;
      },
      {
        totalIncome: 0,
        totalExpenses: 0,
        incomeByCategory: {},
        expensesByCategory: {},
      }
    );

    const result = {
      ...summary,
      balance: summary.totalIncome - summary.totalExpenses,
      incomeByCategory: Object.entries(summary.incomeByCategory).map(
        ([category, value]) => ({ category, value })
      ),
      expensesByCategory: Object.entries(summary.expensesByCategory).map(
        ([category, value]) => ({ category, value })
      ),
    };
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
    } = req.query;
    const filters = { user: req.user.id }; // assuming user ID in req.user

    if (category) filters.category = category;
    if (startDate && endDate)
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    if (minAmount)
      filters.amount = { ...filters.amount, $gte: Number(minAmount) };
    if (maxAmount)
      filters.amount = { ...filters.amount, $lte: Number(maxAmount) };

    const pageSize = 10;
    const total = await Transaction.countDocuments(filters);
    const transactions = await Transaction.find(filters)
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ total, transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { date, category, type, amount } = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { date, category, type, amount },
      { new: true }
    );
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
