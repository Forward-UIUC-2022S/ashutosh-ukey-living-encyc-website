const express = require("express");
const Keyword = require("../models/keyword");
const wiki = require("wikijs").default();

const { streamWrite } = require("@rauschma/stringio");

const { proc: whooshProc } = require("../boot/whoosh");

const whooshProcBuf = require("../boot/whoosh").outBuf();

const router = express.Router();

const NUM_WIKI_RESULTS = 15;
const NUM_EX_SENTS = 9;

async function addExampleSents(keyword) {
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
  const keyword = await Keyword.get(req.query.id);

  await Promise.all([addWikiInfo(keyword), addExampleSents(keyword)]);
  res.send(keyword);
});

router.get("/search", async (req, res) => {
  const keywords = await Keyword.search(req.query.query);
  res.send(keywords);
});

module.exports = router;
