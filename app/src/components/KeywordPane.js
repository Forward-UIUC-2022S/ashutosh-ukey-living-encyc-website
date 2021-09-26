import { useEffect, useState } from "react";

import TransparentButton from "./TransparentButton";

import { Box, Typography, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  googleIcon: {
    height: 24,
    marginLeft: 13,
    marginTop: 3,
  },
  wikiIcon: {
    marginRight: 12,
    height: 40,
  },
  wikiTitleContainer: {
    display: "flex",
    alignItems: "center",
  },
  wikiSummaryText: {
    fontSize: 12,
  },
  wikiSummaryContainer: {
    marginTop: 8,
    maxHeight: 175,
    overflowY: "scroll",
    paddingRight: 4,
  },
  container: {
    backgroundColor: theme.palette.backGray.main,
    maxWidth: 280,
    border: "9px solid",
    borderColor: theme.palette.pendingYellow.main,
    flex: 1,
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 5,
    marginLeft: 10,
  },
  titleContainer: {
    display: "flex",
  },
  titleText: {
    fontSize: 18,
    wordBreak: "break-all",
    hyphens: "auto",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 14,
  },
}));

export default function KeywordPane(props) {
  const classes = useStyles();
  const { keywordId } = props;

  const [keyword, setKeyword] = useState();

  useEffect(() => {
    async function getKeywordInfo() {
      if (keywordId) {
        const keywordInfoUrl = "/keyword?id=" + keywordId;
        let res = await fetch(keywordInfoUrl, {
          method: "GET",
        });
        res = await res.json();
        setKeyword(res);
        console.log("Keyword info: ", res);
      }
    }

    getKeywordInfo();
  }, [keywordId]);

  const googleSearchQuery = encodeURIComponent(keyword?.name);
  const googleSearchUrl = "http://www.google.com/search?q=" + googleSearchQuery;

  return !keyword ? null : (
    <Box className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography className={classes.titleText}>{keyword.name}</Typography>
        <TransparentButton href={googleSearchUrl} target="_blank">
          <img
            className={classes.googleIcon}
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          />
        </TransparentButton>
      </div>
      <div className={classes.infoContainer}>
        <TransparentButton href={keyword.wiki.mainUrl} target="_blank">
          <div className={classes.wikiTitleContainer}>
            <img
              className={classes.wikiIcon}
              src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg"
            />

            <Typography className={classes.infoTitle}>
              <b>Wikipedia</b>{" "}
              {keyword.wiki.search ? "(search results)" : "(article)"}
            </Typography>
          </div>
        </TransparentButton>

        <div className={classes.wikiSummaryContainer}>
          {keyword.wiki.summary && (
            <Typography className={classes.wikiSummaryText}>
              {keyword.wiki.summary}
            </Typography>
          )}
          {keyword.wiki.search && (
            <ul>
              {keyword.wiki.search.map((res) => (
                <li>
                  <TransparentButton href={res.url} target="_blank">
                    {res.title}
                  </TransparentButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {keyword.definition && (
        <Typography className={classes.infoText}>
          <b>Definition:</b> {keyword.definition}
        </Typography>
      )}
    </Box>
  );
}
