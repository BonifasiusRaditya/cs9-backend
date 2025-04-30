require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
    },
});
/*console.log(process.env.PG_CONNECTION_STRING);
const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
});*/

const connect = async () => {
    try {
        console.log("Connected to database");
    } catch (error) {
        console.error("Error connecting to database", error);
    }
}

connect();

const query = async (text, params) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

module.exports = {
    query,
};