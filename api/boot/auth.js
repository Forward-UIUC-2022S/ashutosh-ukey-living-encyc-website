const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user");

const logSqlError = require("../utils");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: `http://localhost:${process.env["PORT"]}/auth/callback`,
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, done) {
      User.findOrCreate(profile, (err, user) => {
        done(err, user);
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
