const MIN_SAME_LABELS = 2;
const MAX_SEARCH_RESULTS = 20;

const { findCommonSubstr } = require("../utils");
const conAsync = require("../boot/db.js");

const Keyword = {};

Keyword.getSimilarAttrs = async (keywordIds) => {
  if (keywordIds.length === 0) return {};
  const con = await conAsync;

  let getKeywordInfo = `
    SELECT id, name, pos

    FROM keyword
    WHERE id IN (?)
  `;

  const [rows, _] = await con.query(getKeywordInfo, [keywordIds]);

  // Find common POS pattern
  let commonPosPattern = rows[0].pos;
  for (let i = 1; i < rows.length; i++) {
    const curPosPattern = rows[i].pos;

    if (curPosPattern !== commonPosPattern) {
      commonPosPattern = null;
      break;
    }
  }

  // Find common substring
  let commonSubstr = rows[0].name;
  for (let i = 1; i < rows.length; i++) {
    commonSubstr = findCommonSubstr(commonSubstr, rows[i].name);

    if (commonSubstr.length < 3) {
      commonSubstr = null;
      break;
    }
  }
  commonSubstr = commonSubstr?.trim();

  // Calculate length range
  let minLength = rows[0].name.length;
  let maxLength = minLength;

  for (let i = 1; i < rows.length; i++) {
    const curLength = rows[1].name.length;

    if (curLength < minLength) minLength = curLength;
    if (curLength > maxLength) maxLength = curLength;
  }

  return {
    nameQuery: commonSubstr,
    posPattern: commonPosPattern,
    lengthRange: [minLength, maxLength],
  };
};

Keyword.get = async (keywordId) => {
  const con = await conAsync;

  let findKeyword = `
    SELECT keyword.id, name, content

    FROM keyword
    LEFT JOIN definition
      ON definition.id = definition_id

    WHERE keyword.id=?
    LIMIT 1
  `;

  const [rows, _] = await con.query(findKeyword, [keywordId]);
  return rows[0];
};

Keyword.search = async (query) => {
  const con = await conAsync;

  let sqlWhereClause = "";
  const sqlParams = [];

  if (query?.length > 0) {
    sqlWhereClause = `WHERE name LIKE ? ORDER BY LENGTH(name)`;

    const sqlSearchPattern = `%${query.toLowerCase()}%`;
    sqlParams.push(sqlSearchPattern);
  }

  let searchKeywords = `
    SELECT keyword.id, name
    FROM keyword

    ${sqlWhereClause}

    LIMIT ${MAX_SEARCH_RESULTS}
  `;

  const [rows, _] = await con.query(searchKeywords, sqlParams);
  return rows;
};

// Handle race condition between multiple labelers
Keyword.checkStableStatus = async (keywordId, fromStatus) => {
  const con = await conAsync;

  const getKeywordStatus = `
    SELECT status
    FROM keyword

    WHERE id=?
  `;

  const [keywords] = await con.query(getKeywordStatus, [keywordId]);
  const keyword = keywords[0];

  return fromStatus === keyword.status;
};

async function getLabelCount(keywordId, label) {
  const con = await conAsync;

  const getCount = `
    SELECT COUNT(*) AS count
    FROM keyword_label

    WHERE keyword_id=?
    AND label=?
  `;

  const [rows] = await con.query(getCount, [keywordId, label]);
  return rows[0].count;
}

Keyword.updateStatus = async (keywordId) => {
  const con = await conAsync;

  const res = await Promise.all([
    getLabelCount(keywordId, "good"),
    getLabelCount(keywordId, "bad"),
  ]);
  const [numGoodLabels, numBadLabels] = res;

  let nextStatus = "";
  if (numGoodLabels >= MIN_SAME_LABELS) {
    nextStatus = "pending-info";
  } else if (numBadLabels >= MIN_SAME_LABELS) {
    nextStatus = "incorrect-domain";
  }

  // If enough labels to change keyword status
  if (nextStatus !== "") {
    const updateKeywordStatus = `
        UPDATE keyword
        SET 
          status=?

        WHERE id=?
      `;
    con.query(updateKeywordStatus, [nextStatus, keywordId]);
  }
};

module.exports = Keyword;
