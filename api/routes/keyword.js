const express = require("express");
const Keyword = require("../models/keyword");
const wiki = require("wikijs").default();

const router = express.Router();

const NUM_WIKI_RESULTS = 15;

router.get("/", async (req, res) => {
  const keyword = await Keyword.get(req.query.id);
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

    // Fetch search results
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

  res.send(keyword);
});

module.exports = router;
