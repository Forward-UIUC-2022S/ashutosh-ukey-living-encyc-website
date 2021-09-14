const con = require("../boot/db.js");
const { logSqlError, isAdmin } = require("../utils");

const User = {};

function addAdminAttr(err, user, next) {
  if (user) user.is_admin = isAdmin(user);

  next(err, user);
}

User.label = (userId, keywordIds, newStatus, done) => {
  const numKeywords = keywordIds.length;

  // Constructing query template
  let whereTemplate = "(";
  for (let i = 0; i < numKeywords - 1; i++) {
    whereTemplate += "?,";
  }
  whereTemplate += "?)";

  const updateKeywordStatus =
    `
    UPDATE keyword_label

    SET status=?

    WHERE user_id=? AND keyword_id IN
  ` + whereTemplate;

  // Ordering query args
  const queryArgs = [newStatus, userId];
  for (let i = 0; i < numKeywords; i++) {
    queryArgs.push(keywordIds[i]);
  }
  con.query(updateKeywordStatus, queryArgs, done);
};

User.getAssigned = (userId, queryStr, status, done) => {
  // Constructing query
  let findUserKeyword = `
    SELECT id, name

    FROM keyword_label
    JOIN keyword ON id=keyword_id

    WHERE status=? AND user_id=?
  `;
  if (status === "pending-auto")
    findUserKeyword += " AND definition IS NOT NULL";

  const queryArgs = [status, userId];
  if (queryStr) {
    findUserKeyword += " AND name LIKE ?";
    queryArgs.push("%" + queryStr.toLowerCase() + "%");
  }
  findUserKeyword += " LIMIT 300";

  con.query(findUserKeyword, queryArgs, done);
};

User.findOrCreate = (googleUser, done) => {
  const userEmail = googleUser.email;

  const findUserByEmail = `SELECT * FROM user WHERE email=?`;
  con.query(findUserByEmail, [userEmail], (err, results) => {
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

      con.query(insertUser, userInfo, (err, results) => {
        if (err) logSqlError(err);
        const dbUserId = results.insertId;

        const findUserById = `
            SELECT * FROM user WHERE id=?
          `;
        con.query(findUserById, [dbUserId], (err, results) => {
          if (err) return logSqlError(err);

          console.log("Created new user", results[0]);
          return addAdminAttr(null, results[0], done);
        });
      });
    }

    // Return existing db user
    else {
      return addAdminAttr(null, results[0], done);
    }
  });
};

module.exports = User;
