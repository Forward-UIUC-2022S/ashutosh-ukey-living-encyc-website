const express = require("express");
const User = require("../models/user");
const { isLoggedIn, isLoggedInAdmin, logSqlError } = require("../utils");

const router = express.Router();

router.post("/upload", isLoggedInAdmin, (req, res) => {
  console.log("File content on the server");
  console.log(req.body);
});

// router.get("/keywords", async (req, res) => {
router.get("/keywords", isLoggedIn, async (req, res) => {
  // const keywords = await User.getUnlabeledKeywords(1, {
  const keywords = await User.getUnlabeledKeywords(
    req.user.id,
    {
      nameQuery: req.query.nameQuery,
      posPattern: req.query.posPattern,
      lengthRange: [req.query.minLength, req.query.maxLength],
    },
    req.query.labelType
  );

  console.log("GET /labeler/keywords", req.query);
  res.send(keywords);
});

// router.put("/keywords/mark", async (req, res) => {
router.put("/keywords/mark", isLoggedIn, async (req, res) => {
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
    console.log("PUT /labeler/keywords/mark", req.body);
  } catch (e) {
    console.error(e);
    res.status(500).send("Problem wih label");
  }
});

router.put("/definitions/mark", isLoggedIn, async (req, res) => {
  try {
    const numAffected = await User.labelDefinitions(
      // 1,
      req.user.id,
      req.body,
      req.query.label
    );

    res.send({
      numAffected: numAffected,
    });
    console.log("PUT /labeler/definition/mark", req.body);
  } catch (e) {
    console.error(e);
    res.status(500).send("Problem wih definition label");
  }
});

router.put("/tutorials/mark", isLoggedIn, async (req, res) => {
  try {
    const numAffected = await User.labelTutorials(
      // 1,
      req.user.id,
      req.body,
      req.query.label
    );

    res.send({
      numAffected: numAffected,
    });
    console.log("PUT /labeler/tutorials/mark", req.body);
  } catch (e) {
    console.error(e);
    res.status(500).send("Problem wih tutorial label");
  }
});

// router.get("/keywords", async (req, res) => {
router.get("/keyword/:keywordId/definitions", isLoggedIn, async (req, res) => {
  // const keywords = await User.getUnlabeledKeywords(1, {
  const keywords = await User.getUnlabeledDefinitions(
    req.user.id,
    req.params.keywordId
  );

  console.log(`GET /labeler/keyword/${req.params.keywordId}/definitions`);
  res.send(keywords);
});

router.get("/keyword/:keywordId/tutorials", isLoggedIn, async (req, res) => {
  const keywords = await User.getUnlabeledTutorials(
    req.user.id,
    req.params.keywordId
  );

  console.log(`GET /labeler/keyword/${req.params.keywordId}/tutorials`);
  res.send(keywords);
});

router.get("/", isLoggedIn, async (req, res) => {
  const userInfo = await User.getSummary(req.user.id);
  res.send(userInfo);

  console.log("GET /labeler", req.user);
});

module.exports = router;
