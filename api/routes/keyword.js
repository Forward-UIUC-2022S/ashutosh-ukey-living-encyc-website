const express = require("express");
const Keyword = require("../models/keyword");
const { logSqlError } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
  const keyword = await Keyword.get(req.query.id);
  res.send(keyword);
});

module.exports = router;
