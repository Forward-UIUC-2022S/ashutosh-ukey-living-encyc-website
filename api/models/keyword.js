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

Keyword.label = async (keywordId, label, fromStatus) => {
  const con = await conAsync;

  const getKeywordStatus = `
    SELECT good_label_count, bad_label_count
    FROM keyword

    WHERE id=?
  `;

  const [keywords] = await con.query(getKeywordStatus, [keywordId]);
  const keyword = keywords[0];

  let numGoodLabels = keyword.good_label_count;
  let numBadLabels = keyword.bad_label_count;

  if (label === "good") numGoodLabels += 1;
  else if (label == "bad") numBadLabels += 1;

  let nextStatus = "";
  if (numGoodLabels >= MIN_SAME_LABELS) {
    nextStatus = "status + 2";
  } else if (numBadLabels >= MIN_SAME_LABELS) {
    nextStatus = "status + 1";
  }

  // If enough labels to change keyword status
  if (nextStatus !== "") {
    const deletePrevLabels = `
        DELETE FROM keyword_label 
        WHERE keyword_id = ?
      `;
    con.query(deletePrevLabels, [keywordId]);

    const updateKeywordStatus = `
        UPDATE keyword
        SET 
          status=${nextStatus},
          good_label_count=0,
          bad_label_count=0

        WHERE id=?
      `;
    con.query(updateKeywordStatus, [keywordId]);
  }

  // Insufficient labels to change keyword status
  else {
    const updateKeywordStatus = `
      UPDATE keyword
      SET 
        good_label_count=${numGoodLabels},
        bad_label_count=${numBadLabels}

      WHERE id=?
    `;
    con.query(updateKeywordStatus, [keywordId]);

    return { todo: "add-label" };
  }
};

module.exports = Keyword;
