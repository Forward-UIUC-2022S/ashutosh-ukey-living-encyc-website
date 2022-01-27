const dbConnPool = require("../boot/db.js");
const { MIN_SAME_LABELS } = require("../utils");

const Tutorial = {};

async function getLabelCount(tutorialId, label) {
  const con = await dbConnPool;

  const getCount = `
    SELECT COUNT(*) AS count
    FROM tutorial_label

    WHERE tutorial_id=?
    AND label=?
  `;

  const [rows] = await con.query(getCount, [tutorialId, label]);
  return rows[0].count;
}

Tutorial.updateStatus = async (tutorialId) => {
  const con = await dbConnPool;

  const res = await Promise.all([
    getLabelCount(tutorialId, "good"),
    getLabelCount(tutorialId, "bad"),
  ]);
  const [numGoodLabels, numBadLabels] = res;

  let nextStatus = "";
  if (numGoodLabels >= MIN_SAME_LABELS) {
    nextStatus = "verified";
  } else if (numBadLabels >= MIN_SAME_LABELS) {
    nextStatus = "incorrect";
  }

  // If enough labels to change tutorial status
  if (nextStatus !== "") {
    const updateTutorialStatus = `
          UPDATE tutorial
          SET 
            status=?
  
          WHERE id=?
        `;
    con.query(updateTutorialStatus, [nextStatus, tutorialId]);
  }
};

module.exports = Tutorial;
