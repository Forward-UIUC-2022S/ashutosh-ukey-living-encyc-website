const express = require("express");
const User = require("../models/user");
const { isLoggedInAdmin } = require("../utils");

const router = express.Router();

router.post("/upload", isLoggedInAdmin, (req, res) => {
  console.log("File content on the server");
  console.log(req.body);
});

router.get("/reports", async (req, res) => {
  const report = await User.getLabelerReport();

  console.log("GET /admin/reports");
  res.send(report);
});

module.exports = router;
