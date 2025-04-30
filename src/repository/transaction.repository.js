const db = require("../database/pg.database");

exports.createTransaction = async ({ item_id, quantity, user_id }) => {
    try {
        const itemResult = await db.query("SELECT price FROM items WHERE id = $1", [item_id]);
        const price = itemResult.rows[0].price;
        const total = price * quantity;
        const transaction = await db.query(
            "INSERT INTO transactions (item_id, quantity, user_id, total) VALUES ($1, $2, $3, $4) RETURNING *",
            [item_id, quantity, user_id, total]
        );
        return transaction.rows[0];
    } catch (error) {
        console.error("❌ createTransaction error:", error);
        throw error;
    }
};

exports.payTransaction = async (id) => {
    try {
        const transactionResult = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
        if (transactionResult.rows.length === 0) {
            throw new Error("Transaction not found");
        }

        const transaction = transactionResult.rows[0];
        const user_id = transaction.user_id;
        const total = transaction.total;
        const item_id = transaction.item_id;
        const quantity = transaction.quantity;

        const userResult = await db.query("SELECT balance FROM users WHERE id = $1", [user_id]);
        const balance = userResult.rows[0].balance;
        const itemResult = await db.query("SELECT stock FROM items WHERE id = $1", [item_id]);
        const stock = itemResult.rows[0].stock;

        if (balance < total) {
            throw new Error("Uang Gak Cukup");
        }
        if (stock < quantity) {
            throw new Error("Stock Gak Cukup");
        }

        const newBalance = balance - total;
        const newStock = stock - quantity;
        await db.query("UPDATE users SET balance = $1 WHERE id = $2", [newBalance, user_id]);
        await db.query("UPDATE items SET stock = $1 WHERE id = $2", [newStock, item_id]);

        const updatedTransaction = await db.query(
            "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *",
            [id]
        );

        return updatedTransaction.rows[0];
    } catch (error) {
        console.error("❌ payTransaction error:", error);
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    try {
        const result = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("❌ deleteTransaction error:", error);
        throw error;
    }
};

exports.getTransactions = async () => {
    try {
        //i want to return the transactions with the item name and user name
        const transactions = await db.query(
            "SELECT t.id AS transaction_id, t.quantity, t.total, t.status, t.created_at AS transaction_time, u.id AS user_id, u.name AS user_name, u.email AS user_email, u.balance AS user_balance, i.id AS item_id, i.name AS item_name, i.price AS item_price, i.stock AS item_stock, i.image_url, i.store_id FROM transactions t JOIN users u ON t.user_id = u.id JOIN items i ON t.item_id = i.id;"
        );
        if (transactions.rows.length === 0) {
            throw new Error("No transactions found");
        }
        return transactions.rows;
    } catch (error) {
        console.error("❌ getTransactions error:", error);
        throw error;
    }
};
