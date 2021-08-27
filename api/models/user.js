const con = require("../boot/db.js");
const logSqlError = require("../utils");

const User = {};

User.findOrCreate = (googleUser, done) => {
  const userEmail = googleUser.email;

  const findUserByEmail = `SELECT * FROM user WHERE email=?`;
  con.query(findUserByEmail, [userEmail], (err, results, fields) => {
    if (err) return logSqlError(err);

    // Insert new user into db
    if (results.length == 0) {
      const insertUser = `
          INSERT INTO user (email, first_name, last_name)
          VALUES (?, ?, ?)
        `;
      let userInfo = [
        googleUser.email,
        googleUser.given_name,
        googleUser.family_name,
      ];

      con.query(insertUser, userInfo, (err, results, fields) => {
        if (err) logSqlError(err);
        const dbUserId = results.insertId;

        const findUserById = `
            SELECT * FROM user WHERE id=?
          `;
        con.query(findUserById, [dbUserId], (err, results, fields) => {
          if (err) return logSqlError(err);

          console.log("Created new user", results[0]);
          return done(null, results[0]);
        });
      });
    }

    // Return existing db user
    else {
      return done(null, results[0]);
    }
  });
};

module.exports = User;
