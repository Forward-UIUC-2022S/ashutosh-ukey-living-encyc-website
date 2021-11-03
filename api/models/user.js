const MAX_RESULTS = 350;

// const assert = require("assert");

const conAsync = require("../boot/db.js");
const Keyword = require("./keyword.js");
const Definition = require("./definition.js");
const Tutorial = require("./tutorial.js");

const { isAdmin } = require("../utils");

const User = {};

function addAdminAttr(user) {
  if (user) user.is_admin = isAdmin(user);

  return user;
}

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

User.getSummary = async (userId) => {
  const con = await conAsync;
  const res = {};

  // Total number of keywords labeled by user
  const getTotalKeywords = `
    SELECT COUNT(*) AS count 

    FROM keyword_label 
    WHERE user_id = ?
  `;
  let [rows] = await con.query(getTotalKeywords, [userId]);
  res.totalKeywords = rows[0].count;

  // Total number of definitions labeled by user
  const getTotalDefinitions = `
    SELECT COUNT(*) AS count 

    FROM definition_label 
    WHERE user_id = ?
  `;
  [rows] = await con.query(getTotalDefinitions, [userId]);
  res.totalDefinitions = rows[0].count;

  // Total number of tutorials labeled by user
  const getTotalTutorials = `
    SELECT COUNT(*) AS count 

    FROM tutorial_label 
    WHERE user_id = ?
  `;
  [rows] = await con.query(getTotalTutorials, [userId]);
  res.totalTutorials = rows[0].count;

  return res;
};

User.getUnlabeledKeywords = async (userId, searchOpts, labelType) => {
  const con = await conAsync;

  // Get keywords with unverified domain relevance
  let findKeywords = `
    SELECT id, name, root_id

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

  // Get keywords with unverified definitions
  if (labelType === "definition")
    findKeywords = `
      SELECT id, name, root_id

      FROM keyword 
      JOIN
        (
          -- Get keywords with pending definitions user has not labeled
          SELECT DISTINCT(keyword_id) AS keyword_id

          FROM definition
          LEFT JOIN 
            ( 
              SELECT definition_id, user_id
              FROM definition_label 
              WHERE user_id = ?
            ) AS user_definition_labels
          ON definition.id = definition_id

          WHERE definition.status = 'pending'
            AND user_definition_labels.definition_id IS NULL
        ) AS unlabeled_defs_keywords

      ON id = keyword_id

      WHERE keyword.status = 'pending-info' 
    `;
  else if (labelType === "tutorial")
    findKeywords = `
      SELECT id, name, root_id

      FROM keyword 
      JOIN
        (
          -- Get keywords with pending tutorials user has not labeled
          SELECT DISTINCT(keyword_id) AS keyword_id

          FROM tutorial
          LEFT JOIN 
            ( 
              SELECT tutorial_id, user_id
              FROM tutorial_label 
              WHERE user_id = ?
            ) AS user_tutorial_labels
          ON tutorial.id = tutorial_id

          WHERE tutorial.status = 'pending'
            AND user_tutorial_labels.tutorial_id IS NULL
        ) AS unlabeled_tutors_keywords

      ON id = keyword_id

      WHERE keyword.status = 'pending-info' 
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
  if (keywords.length === 0) return [];

  // Group keywords by root
  const keywordIds = keywords.map((e) => e.id);

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

    if (!result?.error) {
      numAffected += 1;
      await Keyword.updateStatus(keywordId);
    } else console.log(result?.error);
  }

  // Update db labels in parallel
  // NOTE: possible to reformat by using SQL JOIN, but negligible difference
  await Promise.all(keywordIds.map(labelHelper));

  console.log(`Succesfully labeled ${numAffected} keywords`);
  return numAffected;
};

User.getUnlabeledDefinitions = async (userId, keywordId) => {
  const con = await conAsync;

  let findDefinitions = `
    SELECT id, content

    FROM definition
    LEFT JOIN 
      ( 
        SELECT definition_id
        FROM definition_label 
        WHERE user_id = ?
      ) AS user_keyword_labels
    ON id = definition_id

    WHERE keyword_id = ?
      AND status = 'pending'
      AND definition_id IS NULL
  `;
  const queryArgs = [userId, keywordId];
  const [definitions] = await con.query(findDefinitions, queryArgs);

  return definitions;
};

User.labelDefinitions = async (userId, definitionIds, label) => {
  const con = await conAsync;
  let numAffected = 0;

  async function labelHelper(definitionId) {
    // Log user's label for current keyword
    const insertUserLabel = `
    INSERT INTO definition_label 
      (definition_id, user_id, label)
    VALUES 
      (?, ?, ?)
  `;
    const result = await con.query(insertUserLabel, [
      definitionId,
      userId,
      label,
    ]);

    if (!result?.error) {
      numAffected += 1;
      await Definition.updateStatus(definitionId);
    } else console.log(result?.error);
  }

  // Update db labels in parallel
  // NOTE: possible to reformat by using SQL JOIN, but negligible difference
  await Promise.all(definitionIds.map(labelHelper));

  console.log(`Succesfully labeled ${numAffected} definitions`);
  return numAffected;
};

User.getUnlabeledTutorials = async (userId, keywordId) => {
  const con = await conAsync;

  let findTutorials = `
    SELECT id, title, url, 
      authors, year, num_citation

    FROM tutorial

    -- Ignore tutorials already labeled by user
    LEFT JOIN 
      ( 
        SELECT tutorial_id
        FROM tutorial_label 
        WHERE user_id = ?
      ) AS user_tutorial_labels
    ON id = tutorial_id

    WHERE keyword_id = ?
      AND status = 'pending'
      AND tutorial_id IS NULL
  `;
  const queryArgs = [userId, keywordId];
  const [tutorials] = await con.query(findTutorials, queryArgs);

  return tutorials;
};

User.labelTutorials = async (userId, tutorialIds, label) => {
  const con = await conAsync;
  let numAffected = 0;

  async function labelHelper(tutorialId) {
    // Log user's label for current keyword
    const insertUserLabel = `
    INSERT INTO tutorial_label 
      (tutorial_id, user_id, label)
    VALUES 
      (?, ?, ?)
  `;
    const result = await con.query(insertUserLabel, [
      tutorialId,
      userId,
      label,
    ]);

    if (!result?.error) {
      numAffected += 1;
      await Tutorial.updateStatus(tutorialId);
    } else console.log(result?.error);
  }

  // Update db labels in parallel
  // NOTE: possible to reformat by using SQL JOIN, but negligible difference
  await Promise.all(tutorialIds.map(labelHelper));

  console.log(`Succesfully labeled ${numAffected} tutorials`);
  return numAffected;
};

module.exports = User;
