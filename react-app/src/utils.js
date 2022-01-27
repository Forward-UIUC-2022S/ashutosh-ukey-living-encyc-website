import { makeStyles } from "@material-ui/core/styles";

export function fetchApi(url, opts = {}) {
  const apiUrl = process.env.REACT_APP_API_BASE_URL + url;
  const apiOpts = { ...opts, credentials: "include" };

  return fetch(apiUrl, apiOpts);
}

export function makeStylesStable(styles) {
  return makeStyles(styles, { index: 1 });
}

export const tabToLabelType = {
  domain: "keyword",
  tutorial: "tutorial",
  definition: "definition",
};

function getDefaultValue(cookieValue, defaultValue) {
  if (cookieValue === undefined) return defaultValue;
  else return cookieValue;
}

export function getHoverInteract(cookies) {
  return getDefaultValue(cookies.settings?.hoverInteract, true);
}

export const iconProps = (iconSize) => ({
  sx: { fontSize: iconSize },
});

export function staticButtonColorStyle(color) {
  return {
    backgroundColor: color,
    "&:hover": {
      background: color,
    },
  };
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
 * Title Caps
 *
 * Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
 * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
 * License: http://www.opensource.org/licenses/mit-license.php
 */

var small =
  "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

export const titleCaps = function (title) {
  var parts = [],
    split = /[:.;?!] |(?: |^)["Ò]/g,
    index = 0;

  while (true) {
    var m = split.exec(title);

    parts.push(
      title
        .substring(index, m ? m.index : title.length)
        .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function (all) {
          return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
        })
        .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
        .replace(
          RegExp("^" + punct + small + "\\b", "ig"),
          function (all, punct, word) {
            return punct + upper(word);
          }
        )
        .replace(RegExp("\\b" + small + punct + "$", "ig"), upper)
    );

    index = split.lastIndex;

    if (m) parts.push(m[0]);
    else break;
  }

  return parts
    .join("")
    .replace(/ V(s?)\. /gi, " v$1. ")
    .replace(/(['Õ])S\b/gi, "$1s")
    .replace(/\b(AT&T|Q&A)\b/gi, function (all) {
      return all.toUpperCase();
    });
};

function lower(word) {
  return word.toLowerCase();
}

function upper(word) {
  return word.substr(0, 1).toUpperCase() + word.substr(1);
}
