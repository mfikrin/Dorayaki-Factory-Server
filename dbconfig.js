const Pool = require("pg").Pool;
const dotenv = require("dotenv");

dotenv.config();

const db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port : process.env.DB_PORT
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to",process.env.DB_NAME);
  });

module.exports = db;