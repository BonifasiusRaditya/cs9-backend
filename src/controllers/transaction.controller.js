const transactionRepository = require("../repository/transaction.repository");
const baseResponse = require("../utils/baseResponse");

exports.transactionCreate = async (req, res) => {
    if (!req.body.item_id || !req.body.quantity || !req.body.user_id) {
        return baseResponse(res, false, 400, "Missing item_id, quantity, or user_id", null);
    }

    if (req.body.quantity < 1) {
        return baseResponse(res, false, 400, "Barang tidak mencukupi", null);
    }

    try {
        const transaction = await transactionRepository.createTransaction({
            item_id: req.body.item_id,
            quantity: req.body.quantity,
            user_id: req.body.user_id,
        });
        baseResponse(res, true, 201, "Transaction created", transaction);
    } catch (error) {
        baseResponse(res, false, 500, "User not Found", error.message || error);
    }
};

exports.payTransaction = async (req, res) => {
    if (!req.params.id) {
        return baseResponse(res, false, 400, "Missing transaction id", null);
    }

    try {
        const transaction = await transactionRepository.payTransaction(req.params.id);
        baseResponse(res, true, 200, "Transaction paid", transaction);
    } catch (error) {
        baseResponse(res, false, 500, "Failed to Pay", error.message || error);
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await transactionRepository.deleteTransaction(id);
        if (!result) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        baseResponse(res, true, 200, "Transaction deleted", result);
    } catch (error) {
        baseResponse(res, false, 500, "Transaction not Found", error.message || error);
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const result = await transactionRepository.getTransactions();
        baseResponse(res, true, 200, "Transactions found", result);
    } catch (error) {
        baseResponse(res, false, 500, "Transactions not Found", error.message || error);
    }
};
