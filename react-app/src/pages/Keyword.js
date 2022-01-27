import React from "react";
import tmpKeywordData from "./tmp-data";

import parse from "html-react-parser";

import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";

import PersonIcon from "@material-ui/icons/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DescriptionIcon from "@mui/icons-material/Description";

import Chart from "react-google-charts";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import TransparentButton from "../components/TransparentButton";
import KeywordDisplayChip from "../components/KeywordDisplayChip";

import { iconProps, fetchApi, titleCaps } from "../utils";
import { Typography } from "@mui/material";

import useStyles, { backIconSize, definitionIconSize } from "./KeywordStyles";

export default function Keyword() {
  const classes = useStyles();

  const { id } = useParams();
  const history = useHistory();

  function handleBackClick() {
    history.goBack();
  }

  const [keywordInfo, setKeywordInfo] = useState();
  const [keywordTimeline, setKeywordTimeline] = useState();
  const [keywordRelSentence, setKeywordRelSentence] = useState();
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    async function getKeywordInfo() {
      const keywordInfoLink = `/keywords/${id}?displayInfo=1`;
      let res = await fetchApi(keywordInfoLink);
      res = await res.json();
      console.log("Heeyyyyy, info!", res);
      setKeywordInfo(res);
    }

    async function getKeywordTimeline() {
      const keywordTimelineUrl = `/keywords/${id}/timeline`;
      let res = await fetchApi(keywordTimelineUrl);
      res = await res.json();

      // const timelineData = [["x", keywordInfo?.name]].concat(
      //   Object.entries(res)
      // );
      setKeywordTimeline(res);
    }

    getKeywordInfo();
    getKeywordTimeline();
  }, [id]);

  async function handleTooltipOpen(queryKeywordId) {
    setRequesting(true);

    const keywordRelSentenceLink = `/keywords/${id}/rel-sentence?qKwId=${queryKeywordId}`;
    let res = await fetchApi(keywordRelSentenceLink);
    res = await res.json();

    setKeywordRelSentence(res[0]);
    setRequesting(false);
  }

  async function handleTooltipClose() {
    setRequesting(false);
  }

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
          <div className={classes.titleContainer}>
            <Typography style={{ fontSize: 30 }}>
              <b>{keywordInfo.name}</b>
            </Typography>
            <TransparentButton href={keywordInfo.wikiurl} target="_blank">
              <img
                className={classes.wikiIcon}
                src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg"
              />
            </TransparentButton>
          </div>
          <div className={classes.definitionsContainer}>
            {/*<Typography style={{ fontSize: 16, marginLeft: 20, marginTop: 10 }}>
              <b>Definition</b>
            </Typography> */}
            <div className={classes.definitionsList}>
              {/*
              <div className={classes.definitionItem}>
                <LibraryBooksIcon {...iconProps(definitionIconSize)} />
                <Typography style={{ marginLeft: 10, fontSize: 14 }}>
                  {keywordInfo.actual_def}
                </Typography>
              </div>
              */}
              <div className={classes.definitionItem}>
                {/* <SmartToyIcon {...iconProps(definitionIconSize)} /> */}
                <LibraryBooksIcon {...iconProps(definitionIconSize)} />
                <Typography style={{ marginLeft: 10, fontSize: 14 }}>
                  <b>Definition: </b>
                  {keywordInfo.generated_def}
                </Typography>
              </div>
            </div>
          </div>
          <div className={classes.surveysAndSimilarSection}>
            <div className={classes.surveysContainer}>
              <Typography style={{ fontSize: 16 }}>
                <b>Surveys</b>
              </Typography>

              <div className={classes.surveysList}>
                {keywordInfo.surveys.map((survey) => (
                  <div className={classes.surveryItem}>
                    <DescriptionIcon />
                    <Typography style={{ fontSize: 12, marginLeft: 5 }}>
                      <a
                        href={survey.url}
                        target="_blank"
                        className={classes.surveyTitleA}
                      >
                        <b>{survey.title}</b>
                        {", "}
                        {survey.authors
                          ?.substring(1, survey.authors.length - 1)
                          .replaceAll("'", "")}
                      </a>
                      {` [${survey.year}, cited by ${survey.num_citation}]`}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className={classes.similarityContainer}>
                {/* <div>
                  <Typography style={{ fontSize: 22 }}>
                    Functionally Similar
                  </Typography>
                  <div className={classes.keywordChipsContainer}>
                    {keywordInfo.funcSimilarKwds.map((k) => (
                      <div className={classes.chipWrapper}>
                        <KeywordDisplayChip keyword={k} />
                      </div>
                    ))}
                  </div>
                </div>
                */}
                <div>
                  <Typography style={{ fontSize: 22 }}>
                    Related Keywords
                  </Typography>
                  <div className={classes.keywordChipsContainer}>
                    {keywordInfo.semSimilarKwds.map((k) => (
                      <Tooltip
                        title={
                          <React.Fragment>
                            {requesting ? (
                              <CircularProgress
                                style={{ alignSelf: "center" }}
                              />
                            ) : (
                              <Typography style={{ marginBottom: 10 }}>
                                {keywordRelSentence}
                              </Typography>
                            )}
                          </React.Fragment>
                        }
                        placement="top-end"
                        onOpen={() => {
                          handleTooltipOpen(k.id);
                        }}
                        onClose={handleTooltipClose}
                      >
                        <div className={classes.chipWrapper}>
                          <KeywordDisplayChip keyword={k} />
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 30, width: 500 }}>
                  <Typography style={{ fontSize: 22, marginBottom: 30 }}>
                    Usage Timeline
                  </Typography>
                  {keywordTimeline ? (
                    <Chart
                      width={800}
                      height={300}
                      chartType="LineChart"
                      loader={<div>Loading Chart</div>}
                      data={keywordTimeline}
                      options={{
                        hAxis: {
                          title: "Year",
                        },
                        vAxis: {
                          title: "Frequency",
                        },
                      }}
                      rootProps={{ "data-testid": "1" }}
                    />
                  ) : (
                    <CircularProgress />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={classes.topEntitiesSection}
            style={{
              marginTop: 50,
              display: "flex",
              height: 500,
              justifyContent: "space-evenly",
            }}
          >
            <div className={classes.topEntitiesContainer}>
              <Typography style={{ fontSize: 16 }}>
                <b>Top papers</b>
              </Typography>
              <div className={classes.topPapersList}>
                {tmpKeywordData.topPapers?.map((paper) => (
                  <div className={classes.paperItem}>
                    <DescriptionIcon />
                    <Typography style={{ fontSize: 12, marginLeft: 5 }}>
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
              <Typography style={{ fontSize: 16 }}>
                <b>Top researchers</b>
              </Typography>
              <div className={classes.topPapersList}>
                {tmpKeywordData.topResearchers?.map((paper) => (
                  <div className={classes.researcherItem}>
                    <Avatar className={classes.avatar} src={paper.photoUrl}>
                      <PersonIcon className={classes.avatarIcon} />
                    </Avatar>
                    <Typography style={{ fontSize: 12, marginLeft: 5 }}>
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
          <div className={classes.articleContainer}>
            <Typography style={{ alignSelf: "center", fontSize: 22 }}>
              Article (auto-generated)
            </Typography>
            {tmpKeywordData.article.map((section) => (
              <div style={{ marginTop: 25 }}>
                <Typography style={{ marginBottom: 5 }}>
                  <b>{section.heading}</b>
                </Typography>
                <Typography>{section.content}</Typography>
              </div>
            ))}
            <div style={{ marginTop: 25 }}>
              <Typography style={{ marginBottom: 5 }}>
                <b>Example sentences</b>
              </Typography>
              <ul>
                {keywordInfo.sentences?.map((elem, idx) => (
                  <li key={idx} className={classes.infoListItem}>
                    "{parse(elem.sentence)}"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
