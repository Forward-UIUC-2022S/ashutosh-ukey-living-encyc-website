require("dotenv").config();

const cors = require("cors");
const express = require("express");
const session = require("express-session");
const passport = require("passport");

const authRouter = require("./routes/auth");
const keywordRouter = require("./routes/keyword");
const keywordVerifyRouter = require("./routes/keywordVerify");

// Execute setup files
const conAsync = require("./boot/db");
require("./boot/auth");
const app = express();

// Include middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env["SESSION_SECRET"],
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const port = process.env["PORT"] || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Declare app routes
app.use("/label", keywordVerifyRouter);
app.use("/keyword", keywordRouter);
app.use("/auth", authRouter);

// Gracefully exit server
async function cleanup() {
  const con = await conAsync;

  con.end();
  server.close();
}

process.on("exit", cleanup);
process.on("SIGINT", cleanup);
