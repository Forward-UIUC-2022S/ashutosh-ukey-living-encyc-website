import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DescriptionIcon from "@mui/icons-material/Description";

import IconButton from "@mui/material/IconButton";
import TransparentButton from "../components/TransparentButton";
import KeywordDisplayChip from "../components/KeywordDisplayChip";

import { iconProps, fetchApi } from "../utils";
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

  useEffect(() => {
    async function getKeywordInfo() {
      const keywordInfoLink = `/keywords/${id}?displayInfo=1`;
      let res = await fetchApi(keywordInfoLink);
      res = await res.json();
      console.log("Heeyyyyy, info!", res);
      setKeywordInfo(res);
    }

    getKeywordInfo();
  }, [id]);

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
            <Typography style={{ fontSize: 16, marginLeft: 20, marginTop: 10 }}>
              <b>Definitions</b>
            </Typography>
            <div className={classes.definitionsList}>
              <div className={classes.definitionItem}>
                <LibraryBooksIcon {...iconProps(definitionIconSize)} />
                <Typography style={{ marginLeft: 10, fontSize: 14 }}>
                  {keywordInfo.actual_def}
                </Typography>
              </div>
              <div className={classes.definitionItem}>
                <SmartToyIcon {...iconProps(definitionIconSize)} />
                <Typography style={{ marginLeft: 10, fontSize: 14 }}>
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
                          .substring(1, survey.authors.length - 1)
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
                <div>
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
                <div style={{ marginTop: 40 }}>
                  <Typography style={{ fontSize: 22 }}>
                    Semantically Similar
                  </Typography>
                  <div className={classes.keywordChipsContainer}>
                    {keywordInfo.semSimilarKwds.map((k) => (
                      <div className={classes.chipWrapper}>
                        <KeywordDisplayChip keyword={k} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
