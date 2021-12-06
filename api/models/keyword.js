const MAX_SEARCH_RESULTS = 20;

const { findCommonSubstr, MIN_SAME_LABELS } = require("../utils");
const dbConnPool = require("../boot/db.js");

const Keyword = {};

Keyword.getSimilarAttrs = async (keywordIds) => {
  if (keywordIds.length === 0) return {};
  const con = await dbConnPool;

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
  const con = await dbConnPool;

  // Get basic keyword info
  const findKeyword = `
    SELECT id, name

    FROM keyword
    WHERE id=?
    LIMIT 1
  `;

  const [rows, _] = await con.query(findKeyword, [keywordId]);
  return rows[0];
};

/* 
  Verified and good quality info that
  we want to display to users (i.e. not manual labelers)

  TODO: change to use verified data
*/
Keyword.getDisplayInfo = async (keywordId) => {
  const con = await dbConnPool;

  // Get definition and wikiurl
  const getBasicInfo = `
    SELECT 
      name, wikiurl,
      actual_def, generated_def


    FROM keyword
    JOIN display_definition 
      ON keyword.id = keyword_id 

    WHERE keyword.id = ?
  `;
  let [rows, _] = await con.query(getBasicInfo, [keywordId]);
  const keywordInfo = rows[0];

  // Get surveys
  const getSurveys = `
    SELECT 
      url, title, authors, 
      year, num_citation 

    FROM survey 
    WHERE keyword_id = ?
  `;
  [rows, _] = await con.query(getSurveys, [keywordId]);
  keywordInfo["surveys"] = rows;

  // Get functionally similar keywords
  const getFuncSimilar = `
    SELECT 
      keyword_id2 AS id, keyword.name,
      score

    FROM related_keyword 
    JOIN keyword
      ON keyword_id2 = keyword.id

    WHERE keyword_id1 = ?
      AND relationship = 'word2vecf'

    ORDER BY score DESC
    LIMIT 10
  `;
  [rows, _] = await con.query(getFuncSimilar, [keywordId]);
  keywordInfo["funcSimilarKwds"] = rows;

  // Get semantically similar keywords
  const getSemSimilar = `
    SELECT 
      keyword_id2 AS id, keyword.name,
      score

    FROM related_keyword 
    JOIN keyword
      ON keyword_id2 = keyword.id

    WHERE keyword_id1 = ?
      AND relationship = 'word2vec'

    ORDER BY score DESC
    LIMIT 10
  `;
  [rows, _] = await con.query(getSemSimilar, [keywordId]);
  keywordInfo["semSimilarKwds"] = rows;

  return keywordInfo;
};

function getSqlSearchPattern(query) {
  return `%${query.toLowerCase()}%`;
}

// TODO: Add flag for display info or not
Keyword.search = async (query, isForDisplay) => {
  const con = await dbConnPool;

  let sqlWhereClause = "ORDER BY id";
  const sqlParams = [];

  if (isForDisplay) {
    sqlWhereClause = `
      JOIN display_definition 
      ON keyword_id = keyword.id 

      WHERE LENGTH(generated_def) > 0
    `;
    if (query?.length > 0) {
      sqlWhereClause += " AND name LIKE ? ORDER BY LENGTH(name) ";
      sqlParams.push(getSqlSearchPattern(query));
    }
    else  { sqlWhereClause += " ORDER BY id ";}
  } else if (query?.length > 0) {
    sqlWhereClause = `WHERE name LIKE ? ORDER BY LENGTH(name)`;

    sqlParams.push(getSqlSearchPattern(query));
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
  const con = await dbConnPool;

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
  const con = await dbConnPool;

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
  const con = await dbConnPool;

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
