const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user");

const { logSqlError } = require("../utils");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: process.env["GOOGLE_CALLBACK_URL"],
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      const user = await User.findOrCreate(profile);
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
