const express = require("express");
const User = require("../models/user");
const { isLoggedIn, isLoggedInAdmin, logSqlError } = require("../utils");

const router = express.Router();

router.post("/upload", isLoggedInAdmin, (req, res) => {
  console.log("File content on the server");
  console.log(req.body);
});

router.get("/pending", isLoggedIn, (req, res) => {
  User.getAssigned(
    req.user.id,
    req.query.query,
    req.query.status,
    (err, keywords) => {
      if (err) return logSqlError(err);

      res.send(keywords);
    }
  );
});

router.put("/", isLoggedIn, (req, res) => {
  User.label(req.user.id, req.body, req.query.status, (err, sqlRes) => {
    if (err) return logSqlError(err);

    res.send({
      numAffected: sqlRes.affectedRows,
    });
  });
});

module.exports = router;
