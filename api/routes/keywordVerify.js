const express = require("express");
const User = require("../models/user");
const Keyword = require("../models/keyword");
const { isLoggedIn, isLoggedInAdmin, logSqlError } = require("../utils");

const router = express.Router();

router.post("/upload", isLoggedInAdmin, (req, res) => {
  console.log("File content on the server");
  console.log(req.body);
});

// router.get("/pending", async (req, res) => {
router.get("/pending", isLoggedIn, async (req, res) => {
  // console.log(req.query);

  const keywords = await User.getUnlabeled(
    req.user.id,
    req.query.query,
    req.query.status
  );

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
