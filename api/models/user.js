const assert = require("assert");

const conAsync = require("../boot/db.js");
const Keyword = require("./keyword.js");

const { isAdmin } = require("../utils");

const User = {};

function addAdminAttr(user) {
  if (user) user.is_admin = isAdmin(user);

  return user;
}

User.getUnlabeled = async (userId, status, searchOpts) => {
  const con = await conAsync;

  let findKeywords = `
    SELECT id, name

    FROM keyword
    LEFT JOIN 
      ( 
        SELECT * 
        FROM keyword_label 
        WHERE user_id = ?
      ) AS user_keyword_lables
    ON id = keyword_id

    WHERE status=?
      AND keyword_id IS NULL
  `;
  const queryArgs = [userId, status];

  if (searchOpts.lengthRange[0]) {
    findKeywords += ` AND CHAR_LENGTH(name) BETWEEN ? AND ? `;

    queryArgs.push(searchOpts.lengthRange[0]);
    queryArgs.push(searchOpts.lengthRange[1]);
  }
  if (searchOpts.posPattern) {
    findKeywords += " AND pos = ? ";
    queryArgs.push(searchOpts.posPattern);
  }
  if (searchOpts.nameQuery) {
    findKeywords += " AND name LIKE ?";
    queryArgs.push("%" + searchOpts.nameQuery.toLowerCase() + "%");
  }
  findKeywords += " LIMIT 300";

  const [keywords] = await con.query(findKeywords, queryArgs);
  return keywords;
};

User.label = async (userId, keywordIds, label, fromStatus) => {
  // Only allow labeling keywords with pending status
  assert(["pending-domain", "pending-info"].includes(fromStatus));

  const con = await conAsync;

  let numAffected = 0;

  async function labelHelper(keywordId) {
    if (!(await Keyword.checkStableStatus(keywordId, fromStatus))) return;

    // Check to make sure user has not already labeled keyword
    const getPrevLabel = `
      SELECT COUNT(*) AS count 
      FROM keyword_label 

      WHERE keyword_id = ?
        AND user_id = ?
    `;
    let [rows] = await con.query(getPrevLabel, [keywordId, userId]);
    assert(rows[0].count === 0);

    const result = await Keyword.label(keywordId, label, fromStatus);

    // Log user's label for current keyword
    if (result?.todo === "add-label") {
      const insertUserLabel = `
          INSERT INTO keyword_label 
            (keyword_id, user_id)
          VALUES 
            (?, ?)
        `;
      con.query(insertUserLabel, [keywordId, userId]);
    }

    if (!result?.error) numAffected += 1;
  }

  // Update db labels in parallel
  // NOTE: possible to reformat by using SQL JOIN, but negligible difference
  await Promise.all(keywordIds.map(labelHelper));

  if (numAffected > 0) {
    const updateUserLabelCount = `
    UPDATE user
    SET num_labeled=num_labeled+${numAffected}
  
    WHERE id=?
  `;
    con.query(updateUserLabelCount, [userId]);
  }

  console.log(`Succesfully labeled ${numAffected} keywords`);
  return numAffected;
};

User.findOrCreate = async (googleUser) => {
  const con = await conAsync;
  const userEmail = googleUser.email;

  const findUserByEmail = `SELECT * FROM user WHERE email=?`;
  const [users] = await con.query(findUserByEmail, [userEmail]);

  // Insert new user into db
  if (users.length == 0) {
    const insertUser = `
          INSERT INTO user (email, first_name, last_name)
          VALUES (?, ?, ?)
        `;
    let userInfo = [
      googleUser.email,
      googleUser.given_name,
      googleUser.family_name,
    ];
    const [result] = await con.query(insertUser, userInfo);
    const dbUserId = result.insertId;

    const findUserById = `
      SELECT * FROM user WHERE id=?
    `;
    let [rows] = await con.query(findUserById, [dbUserId]);
    const newUser = rows[0];

    return addAdminAttr(newUser);
  }

  // Return existing db user
  else {
    return addAdminAttr(users[0]);
  }
};

module.exports = User;
