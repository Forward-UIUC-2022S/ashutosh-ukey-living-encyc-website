const express = require("express");
const User = require("../models/user");
const Keyword = require("../models/keyword");
const { isLoggedIn, isLoggedInAdmin, logSqlError } = require("../utils");

const router = express.Router();

router.post("/upload", isLoggedInAdmin, (req, res) => {
  console.log("File content on the server");
  console.log(req.body);
});

router.get("/pending", async (req, res) => {
  // router.get("/pending", isLoggedIn, async (req, res) => {
  const keywords = await User.getUnlabeled(1, req.query.status, {
    // const keywords = await User.getUnlabeled(req.user.id, req.query.status, {
    nameQuery: req.query.nameQuery,
    posPattern: req.query.posPattern,
    lengthRange: [req.query.minLength, req.query.maxLength],
  });

  console.log("GET /label/pending", req.query);
  res.send(keywords);
});

// router.put("/", async (req, res) => {
router.put("/", isLoggedIn, async (req, res) => {
  console.log(req.query);

  try {
    const numAffected = await User.label(
      req.user.id,
      req.body,
      req.query.label,
      req.query.fromStatus
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
