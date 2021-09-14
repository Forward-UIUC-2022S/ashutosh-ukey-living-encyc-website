const express = require("express");
const Keyword = require("../models/keyword");
const { logSqlError } = require("../utils");

const router = express.Router();

router.get("/", (req, res) => {
  Keyword.get(req.query.id, (err, keywords) => {
    if (err) return logSqlError(err);

    res.send(keywords[0]);
  });
});

module.exports = router;
