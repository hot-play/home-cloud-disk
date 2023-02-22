const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres",
    password: "lbcr2012",
    host: "localhost",
    port: 5432,
    database: "home_cloud_storage",
});

module.exports = pool;
