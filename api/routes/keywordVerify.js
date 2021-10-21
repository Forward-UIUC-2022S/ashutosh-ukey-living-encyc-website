const express = require("express");
const User = require("../models/user");
const Keyword = require("../models/keyword");
const { isLoggedIn, isLoggedInAdmin, logSqlError } = require("../utils");

const router = express.Router();

router.post("/upload", isLoggedInAdmin, (req, res) => {
  console.log("File content on the server");
  console.log(req.body);
});

// router.get("/keywords", async (req, res) => {
router.get("/keywords", isLoggedIn, async (req, res) => {
  // const keywords = await User.getUnlabeledKeywords(1, {
  const keywords = await User.getUnlabeledKeywords(req.user.id, {
    nameQuery: req.query.nameQuery,
    posPattern: req.query.posPattern,
    lengthRange: [req.query.minLength, req.query.maxLength],
  });

  console.log("GET /labeler/keywords", req.query);
  res.send(keywords);
});

// router.put("/keywords/mark", async (req, res) => {
router.put("/keywords/mark", isLoggedIn, async (req, res) => {
  console.log(req.query);

  try {
    const numAffected = await User.labelKeywords(
      // 1,
      req.user.id,
      req.body,
      req.query.label
    );

    res.send({
      numAffected: numAffected,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Problem wih label");
  }
});

module.exports = router;
