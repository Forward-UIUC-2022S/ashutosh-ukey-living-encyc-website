const adminList = process.env["ADMINS"].split(",");

function isLoggedIn(req, res, next, checkAdmin = false) {
  const user = req.user;
  user && (!checkAdmin || isAdmin(req.user)) ? next() : res.sendStatus(401);
}

function isAdmin(user) {
  return user && adminList.includes(user.email);
}

function logSqlError(err) {
  console.error("Mysql error: " + err.message);
}

exports.logSqlError = logSqlError;
exports.isLoggedIn = isLoggedIn;
exports.isAdmin = isAdmin;
