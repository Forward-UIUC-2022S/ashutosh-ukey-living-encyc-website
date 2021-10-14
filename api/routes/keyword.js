const express = require("express");
const Keyword = require("../models/keyword");
const wiki = require("wikijs").default();

const { streamWrite } = require("@rauschma/stringio");

const { proc: whooshProc } = require("../boot/whoosh");

const whooshProcBuf = require("../boot/whoosh").outBuf();

const router = express.Router();

const NUM_WIKI_RESULTS = 15;
const NUM_EX_SENTS = 9;

function checkAbort(hasAborted) {
  if (hasAborted) throw { type: "clientAbort" };
}

async function addExampleSents(keyword) {
  if (!keyword) return;

  let program_cmd_inp = keyword.name.replace(/ /g, "+");
  program_cmd_inp += " " + NUM_EX_SENTS;

  // Query python program for sentences
  await streamWrite(whooshProc.stdin, program_cmd_inp + "\n");

  // Read from program's stdout
  let out_ln = await whooshProcBuf.next();
  out_ln = out_ln.value;

  const sentences = JSON.parse(out_ln);
  keyword.sentences = sentences;
}

async function addWikiInfo(keyword) {
  if (!keyword) return;
  keyword.wiki = {};

  try {
    // Fetch article info for keyword
    let wikiPage = await wiki.page(keyword.name);

    const pageUrl = await wikiPage.url();
    wikiPage = await wikiPage.chain().summary().request();

    keyword.wiki.title = wikiPage.title;
    keyword.wiki.summary = wikiPage.extract;
    keyword.wiki.mainUrl = pageUrl;
  } catch (e) {
    // No wikipedia article found with keyword's name
    if (e.message === "No article found") {
      console.log(e.message);
    } else return console.error(e);

    // Fetch wikipedia search results
    const wikiSearch = await wiki.search(keyword.name, NUM_WIKI_RESULTS, true);
    let wikiSearchResults = wikiSearch.results;

    const wikiPageIdUrl = "http://en.wikipedia.org/?curid=";
    wikiSearchResults = wikiSearchResults.map((res) => ({
      title: res.title,

      // Convert wiki pageids to corresponding url
      url: wikiPageIdUrl + res.pageid,
    }));

    const searchQuery = encodeURIComponent(keyword.name).replace("%20", "+");
    keyword.wiki.mainUrl = "https://en.wikipedia.org/?search=" + searchQuery;
    keyword.wiki.search = wikiSearchResults;
  }
}

router.get("/", async (req, res) => {
  const curUri = "/keyword";

  let hasAborted = false;
  req.on("close", function (err) {
    hasAborted = true;
    res.end();
  });

  const keyword = await Keyword.get(req.query.id);

  await Promise.all([addWikiInfo(keyword), addExampleSents(keyword)]);

  try {
    checkAbort(hasAborted);
    res.send(keyword);
    console.log("GET /keyword", req.query);
  } catch (error) {
    if (error?.type === "clientAbort") console.log("ABORT /keyword", req.query);
    else throw error;
  }
});

router.get("/common-attrs", async (req, res) => {
  const idsArray = req.query.ids.split(",");
  const commonAttrs = await Keyword.getSimilarAttrs(idsArray);

  res.send(commonAttrs);
  console.log("GET /keyword/common-attrs", req.query);
});

router.get("/search", async (req, res) => {
  const keywords = await Keyword.search(req.query.query);
  res.send(keywords);
});

module.exports = router;
