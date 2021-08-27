const mysql = require("mysql2");
const logSqlError = require("../utils");

const con = mysql.createConnection({
  host: "localhost",
  user: process.env["MYSQL_USER"],
  password: process.env["MYSQL_PASS"],
  database: process.env["MYSQL_DB"],
});

con.connect((err) => {
  if (err) return logSqlError(err);

  const createUser = `
    CREATE TABLE IF NOT EXISTS user(
      id INT NOT NULL AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      PRIMARY KEY (id)
    )
  `;

  con.query(createUser, (err, results, fields) => {
    if (err) return logSqlError(err);
  });

  const createKeywordLabel = `
    CREATE TABLE IF NOT EXISTS keyword_label(
      keyword_id INT NOT NULL,
      user_id INT NOT NULL,
      status INT DEFAULT 0,
      create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_time TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (keyword_id, user_id),
      FOREIGN KEY (keyword_id) REFERENCES keyword(keyword_id),
      FOREIGN KEY (user_id) REFERENCES user(id)
    )
  `;

  con.query(createKeywordLabel, (err, results, fields) => {
    if (err) return logSqlError(err);
  });
});

module.exports = con;
/*
let testSql = `
  SELECT *

  FROM FoS
  LIMIT 5
`;

connection.query(testSql, (error, results, fields) => {
  if (error) return console.log(error.message);

  console.log(results[0].FoS_name);
});
*/
