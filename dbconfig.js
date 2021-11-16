const Pool = require("pg").Pool;

const db = new Pool({
    user : "postgres",
    password : "admin",
    host : "localhost",
    database : "factorydb",
    port : 5432
});

module.exports = db;