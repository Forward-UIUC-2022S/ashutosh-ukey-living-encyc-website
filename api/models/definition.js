const conAsync = require("../boot/db.js");
const { MIN_SAME_LABELS } = require("../utils");

const Definition = {};

async function getLabelCount(definitionId, label) {
  const con = await conAsync;

  const getCount = `
    SELECT COUNT(*) AS count
    FROM definition_label

    WHERE definition_id=?
    AND label=?
  `;

  const [rows] = await con.query(getCount, [definitionId, label]);
  return rows[0].count;
}

Definition.updateStatus = async (definitionId) => {
  const con = await conAsync;

  const res = await Promise.all([
    getLabelCount(definitionId, "good"),
    getLabelCount(definitionId, "bad"),
  ]);
  const [numGoodLabels, numBadLabels] = res;

  let nextStatus = "";
  if (numGoodLabels >= MIN_SAME_LABELS) {
    nextStatus = "verified";
  } else if (numBadLabels >= MIN_SAME_LABELS) {
    nextStatus = "incorrect";
  }

  // If enough labels to change definition status
  if (nextStatus !== "") {
    const updateDefinitionStatus = `
          UPDATE definition
          SET 
            status=?
  
          WHERE id=?
        `;
    con.query(updateDefinitionStatus, [nextStatus, definitionId]);
  }
};

module.exports = Definition;
