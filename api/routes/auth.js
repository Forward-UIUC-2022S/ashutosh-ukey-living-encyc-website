const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../utils");

const router = express.Router();

// Defining authentication routes
router.get(
  "/login",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: process.env["CLIENT_HOME_PAGE_URL"],
    successRedirect: `${process.env["CLIENT_HOME_PAGE_URL"]}verify`,
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env["CLIENT_HOME_PAGE_URL"]);
});

router.get("/verify", isLoggedIn, (req, res) => res.send(req.user));

// Default exports
module.exports = router;

// // Named exports
// const exports = module.exports;
// exports.isLoggedIn = isLoggedIn;
