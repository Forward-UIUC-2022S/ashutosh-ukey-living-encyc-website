const express = require("express");
const isAdmin = require("../utils").isAdmin;

const router = express.Router();

router.post("/upload", isAdmin, (req, res) => {
  console.log("File content on the server");
  console.log(req.body);
});

module.exports = router;
