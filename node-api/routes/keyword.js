const axios = require("axios");

const express = require("express");
const Keyword = require("../models/keyword");
const wiki = require("wikijs").default();

const { streamWrite } = require("@rauschma/stringio");

const { proc: whooshProc } = require("../boot/whoosh");

const { spawn } = require("child_process");
const whooshProcBuf = require("../boot/whoosh").outBuf();

const router = express.Router();

const RANK_API_ROOT = "http://education.today:8080";

/* 
  If true, fetches pre-computed / cached keyword profile content from database.
  Otherwise, runs scripts in real time below to get content. 
  
  Note: this behavior is only controllable for certain sections. Some sections
  default to always running the full script to fetch the content.

  TODO: make all sections configurable
*/
const USE_CACHED_SECTIONS = true;

const TIMELINE_SCRIPT_PATH = `${process.env["MODULES_DIR"]}/angeline-prabakar-keyword-usage-within-domain/run.sh`;
const REL_SENTENCES_SCRIPT_PATH = `${process.env["MODULES_DIR"]}/henrik-tseng-meaningful-relations-between-keywords/run.sh`;
const COURSE_FINDER_SCRIPT_PATH = `${process.env["MODULES_DIR"]}/zicheng-ma-educational-website-and-courses-finder-for-keyword/run.sh`;
const SURVEY_FINDER_SCRIPT_PATH = `${process.env["MODULES_DIR"]}/matthew-kurapatti-classify-tutorials-surveys/run.sh`;
const QUESTIONS_FINDER_SCRIPT_PATH = `${process.env["MODULES_DIR"]}/matt-ho-keyword-related-questions/run.sh`;

const NUM_WIKI_RESULTS = 15;
const NUM_EX_SENTS = 9;

function checkAbort(hasAborted) {
  if (hasAborted) throw { type: "clientAbort" };
}

async function getExampleSents(keyword, addToObj = false) {
  if (!keyword) return;

  let program_cmd_inp = keyword.name.replace(/ /g, "+");
  program_cmd_inp += " " + NUM_EX_SENTS;

  // Query python program for sentences
  await streamWrite(whooshProc.stdin, program_cmd_inp + "\n");

  // Read from program's stdout
  let out_ln = await whooshProcBuf.next();
  out_ln = out_ln.value;

  const sentences = JSON.parse(out_ln);

  if (addToObj) keyword.sentences = sentences;
  else return sentences;
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

router.get("/common-attrs", async (req, res) => {
  const idsArray = req.query.ids.split(",");
  const commonAttrs = await Keyword.getSimilarAttrs(idsArray);

  res.send(commonAttrs);
  console.log("GET /keyword/common-attrs", req.query);
});

router.get("/", async (req, res) => {
  const keywords = await Keyword.search(
    req.query.query,
    req.query.isForDisplay
  );
  res.send(keywords);
});

function runBash(scriptPath, pythonProgArgs, next) {
  // Spawn new child process to call the python script
  const scriptArgs = [scriptPath, process.env["MODULES_DIR"]].concat(
    pythonProgArgs
  );

  // console.log(scriptArgs);

  const proc = spawn("bash", scriptArgs);

  // Collect data from script
  let returnData;

  proc.stdout.on("data", function (data) {
    returnData = JSON.parse(data.toString());
  });

  // On 'close' event, we are sure that stream from child process is closed
  proc.on("close", (code) => {
    // console.log(code, returnData);
    next(returnData);
  });
}

router.get("/:id/timeline", async (req, res) => {
  const keyword = await Keyword.get(req.params.id);

  runBash(TIMELINE_SCRIPT_PATH, [keyword["name"]], (data) => {
    if (!data) {
      res.send("Error fetching timeline data");
    } else {
      const timelineData = [["x", keyword["name"]]].concat(
        Object.entries(data)
      );
      res.send(timelineData);
    }
  });
});

router.get("/:id/rel-sentence", async (req, res) => {
  // TODO: remove in prod
  // res.send([]);
  // return;

  const keyword = await Keyword.get(req.params.id);
  const queryKeyword = await Keyword.get(req.query.qKwId);

  if (!keyword?.["name"] || !queryKeyword?.["name"]) {
    res.send([]);
  } else {
    runBash(
      REL_SENTENCES_SCRIPT_PATH,
      [keyword["name"], queryKeyword["name"]],
      (data) => {
        res.send(data);
      }
    );
  }
});

router.get("/:id/tutorials", async (req, res) => {
  if (USE_CACHED_SECTIONS) {
    const tutorials = await Keyword.getTutorials(req.params.id);
    res.send(tutorials);
  } else {
    const keyword = await Keyword.get(req.params.id);

    runBash(COURSE_FINDER_SCRIPT_PATH, [keyword["name"], 10], (data) => {
      res.send(data); // Data is of format ['url1', 'url2', ...]
    });
  }
});

router.get("/:id/article", async (req, res) => {
  if (USE_CACHED_SECTIONS) {
    const article = await Keyword.getArticle(req.params.id);
    res.send(article);
  } else {
    const keyword = await Keyword.get(req.params.id);

    runBash(COURSE_FINDER_SCRIPT_PATH, [keyword["name"], 10], (data) => {
      res.send(data); // Data is of format ['url1', 'url2', ...]
    });
  }
});

/*
  Returns 
  [{
      "id": 13650,
      "name": "Jiawei Han",
      "score": 13344,
      "photoUrl": "https://ws.engr.illinois.edu/directory/viewphoto.aspx?id=4947&s=300&type=portrait",
      "affiliation": "university of illinois at urbana champaign",
      "position": "Michael Aiken Chair"
    },
    ...
  ]
 */
router.get("/:id/top-faculty", async (req, res) => {
  const keyword = await Keyword.get(req.params.id);
  const etKwId = await Keyword.getEduTodayId(keyword.name);

  const resp = await axios.get(
    `${RANK_API_ROOT}/cs/rank/authors/rank*${etKwId.toString()}`
  );

  const authors = resp.data.map((e) => ({
    ...e,
    photoUrl: e["photo_url"],
    affiliation: e["inst"]?.["name"],
  }));

  res.send(authors);
});

/*
  Returns 
  [{
      "title": "The Sequence Alignment/Map format and SAMtools",
      "venue": "Bioinformatics",
      "year": 2009,
      "numCitations": 30132,
      "score": 12205
    },
    ...
  ]
 */
router.get("/:id/top-papers", async (req, res) => {
  const keyword = await Keyword.get(req.params.id);
  const etKwId = await Keyword.getEduTodayId(keyword.name);

  const resp = await axios.get(
    `${RANK_API_ROOT}/cs/rank/papers/rank*${etKwId.toString()}`
  );

  const papers = resp.data.map((e) => ({
    // id: e["id"],
    ...e,
    numCitations: e["num_citations"],
  }));

  res.send(papers);
});

/*
  Returns [
    {
      url: 'url', 
      authors: ['author1', 'author2', ...],
      title: 'title',
      year: year,
    },
    ...
  ]
*/
router.get("/:id/surveys", async (req, res) => {
  const keyword = await Keyword.get(req.params.id);

  runBash(SURVEY_FINDER_SCRIPT_PATH, [keyword["name"]], (data) => {
    res.send(
      data.map((e) => ({
        url: e[0],
        authors: e[1],
        title: e[2],
        year: e[3],
      }))
    );
  });
});

router.get("/:id/questions", async (req, res) => {
  if (USE_CACHED_SECTIONS) {
    const questions = await Keyword.getTopQuestions(req.params.id);
    res.send(questions);
  } else {
    const keyword = await Keyword.get(req.params.id);
    runBash(QUESTIONS_FINDER_SCRIPT_PATH, [keyword["name"]], (data) => {
      res.send(data); // Data is of format ['q1', 'q2', ...]
    });
  }
});

/*
  Returns [
    {sentence: 's1'},
    {sentence: 's2'},
    ...
  ]
*/
router.get("/:id/sentences", async (req, res) => {
  // const keyword = await Keyword.get(req.params.id);
  // const sentences = await getExampleSents(keyword);

  const sentences = await Keyword.getExampleSents(req.params.id);
  res.send(sentences);
});

router.put("/:id/sentences/:sentId/flag", async (req, res) => {
  // const keyword = await Keyword.get(req.params.id);
  // const sentences = await getExampleSents(keyword);

  Keyword.flagExampleSent(req.params.id, req.params.sentId);
  // res.send(sentences);
});

router.get("/:id", async (req, res) => {
  let hasAborted = false;
  req.on("close", function (err) {
    hasAborted = true;
    res.end();
  });
  let keyword;

  if (req.query.displayInfo) {
    keyword = await Keyword.getDisplayInfo(req.params.id);
    // await Promise.all([addExampleSents(keyword)]);
  } else {
    keyword = await Keyword.get(req.params.id);
    await Promise.all([addWikiInfo(keyword), getExampleSents(keyword, true)]);
  }

  try {
    checkAbort(hasAborted);
    res.send(keyword);
    console.log(`GET /keyword/${req.params.id}`, req.query);
  } catch (error) {
    if (error?.type === "clientAbort") console.log("ABORT /keyword", req.query);
    else throw error;
  }
});

module.exports = router;
