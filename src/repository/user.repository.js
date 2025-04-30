const db = require("../database/pg.database");

exports.RegisterAccount = async (user) => {
    try {
        const result = await db.query(
            "INSERT INTO users(email, password, name) VALUES($1, $2, $3) RETURNING *",
            [user.email, user.password, user.name] 
        );
        if (!result || !result.rows || result.rows.length === 0) {
            throw new Error("Email Already Registered");
        }
        return result.rows[0];
    } catch (error) {
        console.error("Email Already Registered", error);
        throw error; // Rethrow the error after logging it
    }
};

exports.loginAccount = async (email) => {
    try {
        const result = await db.query(
            "SELECT * from users where email = $1",
            [email]
        );
        if (!result || !result.rows || result.rows.length === 0) {
            throw new Error("Invalid email or password");
        }
        return result.rows[0]; // Return user data, including hashed password
    } catch (error) {
        console.error("User repository error", error);
        throw error;
    }
};

exports.getEmailbyid = async (email) => {
    try {
        const result = await db.query("SELECT * from users where email = $1", [email]);
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error; // Rethrow the error after logging it
    }
};

exports.updateUser = async (user) => {
    try {
        const result = await db.query(
            "UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4 RETURNING *",
            [user.email, user.password, user.name, user.id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error; // Rethrow the error after logging it
    }
};

exports.deleteUser = async (id) => {
    try {
        const result = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error; // Rethrow the error after logging it
    }
};

exports.getUserById = async (id) => {
    try {
        const result = await pg.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0]; // Jika user tidak ditemukan, hasilnya undefined
    } catch (error) {
        console.error("Database error (getUserById):", error);
        throw error;
    }
};

exports.topUp = async (user) => {
    try {
        const result = await db.query(
            "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
            [parseInt(user.balance, 10), user.id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
        throw error;
    }
};
