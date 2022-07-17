import React from "react";
import parse from "html-react-parser";
import tmpKeywordData from "./tmp-data";

import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import PersonIcon from "@material-ui/icons/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DescriptionIcon from "@mui/icons-material/Description";
import TutorialIcon from "@mui/icons-material/RateReview";
import FlagIcon from "@mui/icons-material/Flag";

import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import Chart from "react-google-charts";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import TransparentButton from "../components/TransparentButton";
import KeywordDisplayChip from "../components/KeywordDisplayChip";

import {
  iconProps,
  fetchApi,
  titleCaps,
  highlightText,
  capitalizeFirstLetter,
} from "../utils";
import { Typography } from "@mui/material";

import useStyles, {
  sectionIconSize,
  flagIconSize,
  backIconSize,
  definitionIconSize,
  sectionHeaderStyle,
  mainTitleStyle,
} from "./KeywordStyles";

export default function Keyword() {
  const classes = useStyles();

  const { id } = useParams();
  const history = useHistory();

  function handleBackClick() {
    history.goBack();
  }

  const [keywordInfo, setKeywordInfo] = useState();
  const [keywordTimeline, setKeywordTimeline] = useState();

  const [article, setArticle] = useState({});
  const [topPapers, setTopPapers] = useState();
  const [topResearchers, setTopResearchers] = useState();
  const [exampleSents, setExampleSents] = useState();
  const [frequentQs, setFrequentQs] = useState();
  const [surveys, setSurveys] = useState();
  const [tutorials, setTutorials] = useState();

  const [keywordIdToRelSentence, setKeywordIdToRelSentence] = useState({});

  const [curHoverId, setCurHoverId] = useState();
  const [curHoverType, setCurHoverType] = useState();

  function clearReportHover() {
    setCurHoverType(null);
    setCurHoverId(null);
  }

  function handleReportHover(type, id) {
    setCurHoverType(type);
    setCurHoverId(id);
  }

  function ReportIcon(props) {
    const { id, type } = props;

    // const [showReportSelect, setShowReportSelect] = useState(false);

    function handleReport(reportLabel) {
      if (curHoverType === type && curHoverId === id) {
        if (type === "sent") {
          console.log("flagged sentence");
        } else if (type === "quest") {
          console.log("flagged question");
        }
        console.log(reportLabel);
      }

      clearReportHover();
    }

    return (
      <div
        style={{
          display: "flex",
          minHeight: flagIconSize,
          minWidth: flagIconSize + 20,
        }}
      >
        {curHoverId === id && (
          <Tooltip
            title={
              <div
                style={{
                  backgroundColor: "white",
                }}
              >
                <ButtonGroup variant="text" aria-label="text button group">
                  <Button onClick={() => handleReport("irrelevant")}>
                    Not relevant
                  </Button>
                  <Button onClick={() => handleReport("inaccurate")}>
                    Inaccurate
                  </Button>
                </ButtonGroup>
              </div>
            }
          >
            <IconButton style={{ marginLeft: 20, padding: 0 }}>
              <FlagIcon {...iconProps(flagIconSize)} />
            </IconButton>
          </Tooltip>
        )}
      </div>
    );
  }

  function Reportable(props) {
    const { type, id } = props;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 4,
        }}
        onMouseEnter={() => handleReportHover(type, id)}
        onMouseLeave={clearReportHover}
      >
        {props.children}
        <ReportIcon id={id} type={type} />
      </div>
    );
  }

  async function getRelSentences(queryKeywordId) {
    const keywordRelSentenceLink = `/keywords/${id}/rel-sentence?qKwId=${queryKeywordId}`;
    let res = await fetchApi(keywordRelSentenceLink);
    res = await res.json();

    keywordIdToRelSentence[queryKeywordId] = res;
    setKeywordIdToRelSentence({
      ...keywordIdToRelSentence,
      queryKeywordId: res,
    });
  }

  useEffect(() => {
    async function getKeywordInfo() {
      const keywordInfoLink = `/keywords/${id}?displayInfo=1`;
      let res = await fetchApi(keywordInfoLink);
      res = await res.json();
      // console.log("Heeyyyyy, info!", res);
      setKeywordInfo(res);

      // console.log(res);
      for (let k of res.semSimilarKwds) {
        try {
          getRelSentences(k.id);
        } catch (err) {
          console.log("Yooo, error!!", err);
        }
      }
    }

    async function fetchAndSet(apiUrl, stateSetFunction) {
      let res = await fetchApi(apiUrl);
      res = await res.json();

      stateSetFunction(res);
    }

    getKeywordInfo();
    fetchAndSet(`/keywords/${id}/timeline`, setKeywordTimeline);
    fetchAndSet(`/keywords/${id}/sentences`, setExampleSents);
    fetchAndSet(`/keywords/${id}/questions`, setFrequentQs);
    fetchAndSet(`/keywords/${id}/surveys`, setSurveys);
    fetchAndSet(`/keywords/${id}/tutorials`, setTutorials);
    fetchAndSet(`/keywords/${id}/top-faculty`, setTopResearchers);
    fetchAndSet(`/keywords/${id}/top-papers`, setTopPapers);
    fetchAndSet(`/keywords/${id}/article`, setArticle);
  }, [id]);

  // Convert timeline x (year) column to int
  function xToInt(timeline) {
    if (!timeline) return;
    for (let i = 1; i < timeline.length; i++) {
      timeline[i][0] = parseInt(timeline[i][0]);
    }

    return timeline;
  }

  function getTimelineTicks(timeline, step = 4) {
    if (!timeline) return [1990, 2020];

    // console.log(timeline);
    const earliestYear = timeline[1][0];
    const latestYear = timeline[timeline.length - 1][0];

    const ticks = [];
    for (
      let i = Math.floor(earliestYear / step);
      i <= Math.ceil(latestYear / step);
      i++
    ) {
      ticks.push(i * step);
    }

    // console.log("Hey ticks?", ticks);
    return ticks;
  }

  const keywordTimelineElem = (
    <Chart
      width={350}
      height={125}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={xToInt(keywordTimeline)}
      options={{
        hAxis: {
          // title: "Year",
          ticks: getTimelineTicks(keywordTimeline),
          format: "####",
        },
        vAxis: {
          // title: "Frequency",
          ticks: [],
        },
        legend: { position: "none" },
      }}
      rootProps={{ "data-testid": "1" }}
    />
  );

  return (
    <div className={classes.container}>
      <IconButton
        onClick={handleBackClick}
        style={{ maxWidth: backIconSize + 20 }}
      >
        <ArrowBackIcon {...iconProps(backIconSize)} />
      </IconButton>
      {keywordInfo && (
        <div className={classes.infoContainer}>
          <Typography style={mainTitleStyle}>
            <b>{capitalizeFirstLetter(keywordInfo.name)}</b>
          </Typography>
          {/*<Typography
            style={{
              fontSize: 22,
              marginTop: 30,
            }}
          >
            Overview
          </Typography>*/}
          <div className={classes.overviewSection}>
            <Reportable type="defin" id={keywordInfo.id}>
              <Typography
                style={{
                  maxWidth: "60ch",
                  display: "flex",
                }}
              >
                {keywordInfo.generated_def}
              </Typography>
            </Reportable>
            <div className={classes.timelineContainer}>
              {keywordTimeline ? (
                keywordTimelineElem
              ) : (
                // < div className={classes.loadingCircleContainer}>
                <CircularProgress />
                // </div>
              )}
            </div>
          </div>
          {
            <div className={classes.articleContainer}>
              {/*<Typography style={{ alignSelf: "center", fontSize: 22 }}>
                Article (auto-generated)
              </Typography>*/}
              {Object.keys(article)?.map((section) => (
                <div style={{ marginTop: 25 }}>
                  <Typography style={sectionHeaderStyle}>
                    <b>{capitalizeFirstLetter(section)}</b>
                  </Typography>
                  {article?.[section]?.map((par) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "end",
                        marginTop: 10,
                        paddingLeft: 25,
                      }}
                    >
                      <Reportable type="article-sect" id={par[0]}>
                        <Typography>{par[0]}</Typography>
                        <IconButton href={par[1]["url"]}>
                          <ArrowCircleRightIcon
                            {...iconProps(sectionIconSize)}
                          />
                        </IconButton>
                      </Reportable>
                    </div>
                  ))}
                </div>
              ))}
              {/*<div style={{ marginTop: 25 }}>
                <Typography style={{ marginBottom: 5 }}>
                  <b>Example sentences</b>
                </Typography>
                <ul>
                  {keywordInfo.sentences?.map((elem, idx) => (
                    <li key={idx} className={classes.infoListItem}>
                      <div>"{parse(elem.sentence)}"</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 25 }}>
                <Typography style={{ marginBottom: 5 }}>
                  <b>References</b>
                </Typography>
                <ul>
                  {tmpKeywordData.references?.map((elem, idx) => (
                    <li key={idx} className={classes.infoListItem}>
                      {elem}
                    </li>
                  ))}
                </ul>
              </div>*/}
            </div>
          }
          <div className={classes.usageSection}>
            {exampleSents && (
              <div>
                <Typography style={sectionHeaderStyle}>
                  <b>Example sentences</b>
                </Typography>
                <ul className={classes.usageList}>
                  {exampleSents.map((e) => (
                    <li>
                      <Reportable type="sent" id={e.id}>
                        <Typography>
                          {highlightText(e.sentence, [
                            keywordInfo.name.toLowerCase(),
                          ])}
                        </Typography>
                      </Reportable>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {frequentQs && (
              <div style={{ marginTop: 20 }}>
                <Typography style={sectionHeaderStyle}>
                  <b>Frequent questions</b>
                </Typography>
                <ul className={classes.usageList}>
                  {frequentQs.map((e) => (
                    <li>
                      <Reportable id={e} type="ques">
                        <Typography>
                          {highlightText(e, [keywordInfo.name.toLowerCase()])}
                        </Typography>
                      </Reportable>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/*<Typography
            style={{
              fontSize: 22,
              marginTop: 60,
            }}
          >
            In research
          </Typography>*/}
          <div className={classes.topEntitiesSection}>
            <div className={classes.topEntitiesContainer}>
              <Typography style={sectionHeaderStyle}>
                <b>Top papers</b>
              </Typography>
              <div className={classes.topEntitiesList}>
                {topPapers?.map((paper) => (
                  <div className={classes.paperItem}>
                    <DescriptionIcon />
                    <Typography
                      style={{
                        // fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      <a
                        href={paper.url}
                        target="_blank"
                        className={classes.paperTitleA}
                      >
                        <b>{paper.title}</b>
                        {", "}
                        {paper.authors
                          ?.substring(1, paper.authors.length - 1)
                          .replaceAll("'", "")}
                      </a>
                      {` [${paper.year}, score: ${paper.score}]`}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            <div className={classes.topEntitiesContainer}>
              <Typography style={sectionHeaderStyle}>
                <b>Top researchers</b>
              </Typography>
              <div className={classes.topEntitiesList}>
                {topResearchers?.map((paper) => (
                  <div className={classes.researcherItem}>
                    <Avatar className={classes.avatar} src={paper.photoUrl}>
                      <PersonIcon className={classes.avatarIcon} />
                    </Avatar>
                    <Typography
                      style={{
                        // fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      <a
                        href={paper.url}
                        target="_blank"
                        className={classes.paperTitleA}
                      >
                        <b>{paper.name}</b>
                        {", "}
                        {titleCaps(paper.affiliation)}
                      </a>
                      {` [score: ${paper.score}]`}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/*<Typography
            style={{
              fontSize: 22,
              marginTop: 50,
            }}
          >
            Usage
          </Typography>*/}
          {/*<Typography
            style={{
              fontSize: 22,
              marginTop: 45,
              marginBottom: -10,
            }}
          >
            Reference
          </Typography>*/}
          <div>
            {surveys && surveys.length > 0 && (
              <div className={classes.referencesContainer}>
                <Typography style={sectionHeaderStyle}>
                  <b>Surveys</b>
                </Typography>

                <div className={classes.surveysList}>
                  {surveys.map((survey) => (
                    <div className={classes.surveryItem}>
                      <DescriptionIcon />
                      <Typography
                        style={{
                          // fontSize: 12,
                          marginLeft: 5,
                        }}
                      >
                        <a
                          href={survey.url}
                          target="_blank"
                          className={classes.surveyTitleA}
                        >
                          <b>{survey.title}</b>
                          {", "}
                          {survey.authors.join(",")}
                        </a>
                        {` [${survey.year}]`}
                        {
                          // ` [${survey.year}, cited by ${survey.num_citation}]`
                        }
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tutorials && (
              <div className={classes.referencesContainer}>
                <Typography style={sectionHeaderStyle}>
                  <b>Tutorials</b>
                </Typography>

                <div className={classes.surveysList}>
                  {tutorials.map((tutorial) => (
                    <div className={classes.surveryItem}>
                      <TutorialIcon />
                      <Typography
                        style={{
                          // fontSize: 12,
                          marginLeft: 5,
                        }}
                      >
                        <a
                          href={tutorial}
                          target="_blank"
                          // className={classes.surveyTitleA}
                        >
                          {tutorial}
                        </a>
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: 25,
            }}
          >
            <Typography style={sectionHeaderStyle}>
              <b>Related Keywords</b>
            </Typography>
            <div className={classes.keywordChipsContainer}>
              {keywordInfo.semSimilarKwds.map((k) => {
                return (
                  <Tooltip
                    title={
                      keywordIdToRelSentence[k.id] ? (
                        <div>
                          {keywordIdToRelSentence[k.id].map((sent) => (
                            <Typography
                              style={
                                {
                                  //fontSize: 12
                                }
                              }
                            >
                              -{" "}
                              {highlightText(sent, [
                                keywordInfo.name.toLowerCase(),
                                k.name.toLowerCase(),
                              ])}
                            </Typography>
                          ))}
                        </div>
                      ) : (
                        <CircularProgress style={{ alignSelf: "center" }} />
                      )
                    }
                  >
                    <div>
                      <KeywordDisplayChip keyword={k} variant="bare" />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
          {/*<TransparentButton href={keywordInfo.wikiurl} target="_blank">
            <img
              className={classes.wikiIcon}
              src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg"
            />
          </TransparentButton>*/}
        </div>
      )}
    </div>
  );
}
