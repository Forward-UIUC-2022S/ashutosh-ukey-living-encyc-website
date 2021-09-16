const mysql = require("mysql2/promise");
const bluebird = require("bluebird");

const { logSqlError } = require("../utils");

const conAsync = mysql.createConnection({
  host: "localhost",
  user: process.env["MYSQL_USER"],
  password: process.env["MYSQL_PASS"],
  database: process.env["MYSQL_DB"],
  Promise: bluebird,
});

async function createTables() {
  const con = await conAsync;
  const createUser = `
    CREATE TABLE IF NOT EXISTS user(
      id INT NOT NULL AUTO_INCREMENT,
      
      email VARCHAR(255) NOT NULL,
      first_name VARCHAR(255),
      last_name VARCHAR(255),

      PRIMARY KEY (id)
    )
  `;
  con.query(createUser);

  const createKeywordLabel = `
    CREATE TABLE IF NOT EXISTS keyword_label(
      keyword_id INT NOT NULL,
      user_id INT NOT NULL,

      create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, keyword_id),
      FOREIGN KEY (keyword_id) REFERENCES keyword(id),
      FOREIGN KEY (user_id) REFERENCES user(id)
    )
  `;
  con.query(createKeywordLabel);
}
createTables();

module.exports = conAsync;
