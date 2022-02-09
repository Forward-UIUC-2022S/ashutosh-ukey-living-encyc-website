require("dotenv").config();

// const { getDbConnection } = require("./utils");

const cors = require("cors");
const express = require("express");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");

// const MySQLStore = require('express-mysql-session')(session);

const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const keywordRouter = require("./routes/keyword");
const labelerRouter = require("./routes/labeler");

// Execute setup files
const { proc: whooshProc } = require("./boot/whoosh");
const dbConnPool = require("./boot/db");
// const sessionStore = new MySQLStore({}, dbConnPool);

require("./boot/auth");
const app = express();

// Include middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env["CLIENT_HOME_PAGE_URL"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env["SESSION_SECRET"],
    // store: sessionStore,
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
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
app.use("/labeler", labelerRouter);
app.use("/admin", adminRouter);
app.use("/keywords", keywordRouter);
app.use("/auth", authRouter);

// Gracefully exit server
async function cleanup() {
  // const con = await dbConnPool;

  // con.end();
  server.close();

  whooshProc.kill("SIGINT");
}

process.on("exit", cleanup);
process.on("SIGINT", cleanup);
