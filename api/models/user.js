const MAX_RESULTS = 350;

// const assert = require("assert");

const conAsync = require("../boot/db.js");
const Keyword = require("./keyword.js");

const { isAdmin } = require("../utils");

const User = {};

function addAdminAttr(user) {
  if (user) user.is_admin = isAdmin(user);

  return user;
}

User.getUnlabeledKeywords = async (userId, searchOpts) => {
  const con = await conAsync;

  let findKeywords = `
    SELECT id, name, root_id, LENGTH(name) AS score

    FROM keyword
    LEFT JOIN 
      ( 
        SELECT * 
        FROM keyword_label 
        WHERE user_id = ?
      ) AS user_keyword_labels
    ON id = keyword_id

    WHERE status = 'pending-domain'
      AND keyword_id IS NULL
  `;
  const queryArgs = [userId];

  // Include optional advanced search parameters
  let sortCriteria = "MIN(keyword.id)";

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

    sortCriteria = "LENGTH(lemma)";
  }

  const [keywords] = await con.query(findKeywords, queryArgs);
  const keywordIds = keywords.map((e) => e.id);

  // Group keywords by root
  let findKeywordRoots = `
    SELECT root.id, lemma, ${sortCriteria} AS score

    FROM keyword 
    JOIN root ON root_id = root.id 

    WHERE keyword.id IN (?)
    GROUP BY root.id

    ORDER BY score
    LIMIT ${MAX_RESULTS}
  `;
  const [roots] = await con.query(findKeywordRoots, [keywordIds]);

  const rootIdToKeywords = {};
  for (let root of roots) {
    const rootId = root.id;

    rootIdToKeywords[rootId] = {
      id: rootId,
      lemma: root.lemma,
      keywords: [],
    };
  }

  for (let keyword of keywords) {
    const kwRootId = keyword.root_id;
    if (rootIdToKeywords[kwRootId])
      rootIdToKeywords[kwRootId].keywords.push(keyword);
  }

  return Object.values(rootIdToKeywords);
};

User.labelKeywords = async (userId, keywordIds, label) => {
  const con = await conAsync;
  let numAffected = 0;

  async function labelHelper(keywordId) {
    // Log user's label for current keyword
    const insertUserLabel = `
    INSERT INTO keyword_label 
      (keyword_id, user_id, label)
    VALUES 
      (?, ?, ?)
  `;
    const result = await con.query(insertUserLabel, [keywordId, userId, label]);
    console.log(result?.error);
    if (!result?.error) {
      numAffected += 1;
      await Keyword.updateStatus(keywordId);
    }
  }

  // Update db labels in parallel
  // NOTE: possible to reformat by using SQL JOIN, but negligible difference
  await Promise.all(keywordIds.map(labelHelper));

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
