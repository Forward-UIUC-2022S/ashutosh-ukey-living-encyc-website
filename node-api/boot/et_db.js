const mysql = require("mysql2/promise");
const bluebird = require("bluebird");

const pool = mysql.createPool({
  host: process.env["MYSQL_ET_HOST"],
  user: process.env["MYSQL_ET_USER"],
  password: process.env["MYSQL_ET_PASS"],
  database: process.env["MYSQL_ET_DB"],
  Promise: bluebird,
});

module.exports = pool;
