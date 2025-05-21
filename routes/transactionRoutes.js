const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
} = require("../controllers/transactionController");

router.post("/", protect, createTransaction);
router.get("/", protect, getTransactions);
router.get("/summary", protect, getTransactionSummary);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

module.exports = router;
