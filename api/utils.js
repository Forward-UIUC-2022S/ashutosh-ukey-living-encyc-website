function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

function isAdmin(req, res, next) {
  adminList = ["aukey2@illinois.edu"];

  if (req.user && adminList.include(req.user.email)) next();

  res.sendStatus(401);
}

function logSqlError(err) {
  console.error("Mysql error: " + err.message);
}

exports.logSqlError = logSqlError;
exports.isLoggedIn = isLoggedIn;
exports.isAdmin = isAdmin;
