const con = require("../boot/db.js");

const Keyword = {};

Keyword.get = (keywordId, done) => {
  let findKeyword = `
    SELECT id, name, definition

    FROM keyword

    WHERE id=?
    LIMIT 1
  `;

  con.query(findKeyword, [keywordId], done);
};

module.exports = Keyword;
