const MIN_SAME_LABELS = 2;

const conAsync = require("../boot/db.js");

const Keyword = {};

Keyword.get = async (keywordId, done) => {
  const con = await conAsync;

  let findKeyword = `
    SELECT id, name, definition

    FROM keyword

    WHERE id=?
    LIMIT 1
  `;

  const [rows, _] = await con.query(findKeyword, [keywordId]);
  return rows[0];
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
