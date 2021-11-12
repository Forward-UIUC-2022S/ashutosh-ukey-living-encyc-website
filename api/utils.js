const adminList = process.env["ADMINS"]?.split(",");
const MIN_SAME_LABELS = 2;

function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Taken from https://www.tutorialspoint.com/finding-the-longest-common-consecutive-substring-between-two-strings-in-javascript
function findCommonSubstr(str1 = "", str2 = "") {
  const s1 = [...str1];
  const s2 = [...str2];
  const arr = Array(s2.length + 1)
    .fill(null)
    .map(() => {
      return Array(s1.length + 1).fill(null);
    });
  for (let j = 0; j <= s1.length; j += 1) {
    arr[0][j] = 0;
  }
  for (let i = 0; i <= s2.length; i += 1) {
    arr[i][0] = 0;
  }
  let len = 0;
  let col = 0;
  let row = 0;
  for (let i = 1; i <= s2.length; i += 1) {
    for (let j = 1; j <= s1.length; j += 1) {
      if (s1[j - 1] === s2[i - 1]) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = 0;
      }
      if (arr[i][j] > len) {
        len = arr[i][j];
        col = j;
        row = i;
      }
    }
  }
  if (len === 0) {
    return "";
  }
  let res = "";
  while (arr[row][col] > 0) {
    res = s1[col - 1] + res;
    row -= 1;
    col -= 1;
  }
  return res;
}

function isLoggedIn(req, res, next) {
  isLoggedInHelper(req, res, next, false);
}

function isLoggedInAdmin(req, res, next) {
  isLoggedInHelper(req, res, next, true);
}

function isLoggedInHelper(req, res, next, checkAdmin) {
  const user = req.user;
  user && (!checkAdmin || isAdmin(req.user)) ? next() : res.sendStatus(401);
}

function isAdmin(user) {
  return user && adminList.includes(user.email);
}

function logSqlError(err) {
  console.error("Mysql error: " + err.message);
}

exports.MIN_SAME_LABELS = MIN_SAME_LABELS;

exports.shuffleArray = shuffleArray;
exports.findCommonSubstr = findCommonSubstr;

exports.logSqlError = logSqlError;

exports.isLoggedIn = isLoggedIn;
exports.isLoggedInAdmin = isLoggedInAdmin;
exports.isAdmin = isAdmin;

if (require.main === module) {
  const inp1 = ["machine learning algorithms"];
  const inp2 = ["deep learning algorithm"];

  console.log(findCommonSubstr(inp1[0], inp2[0]));
}
