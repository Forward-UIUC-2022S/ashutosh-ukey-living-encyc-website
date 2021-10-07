// TODO: Add tooltips for each keyword category
import parse from "html-react-parser";
import { useEffect, useState } from "react";

import TransparentButton from "./TransparentButton";

import { Box, Typography, Icon } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";

const loadingComponentProps = {
  size: 50,
  thickness: 2.8,
};

const useStyles = makeStyles((theme) => ({
  infoListItem: {
    fontSize: 12,
    marginLeft: -8,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    paddingTop: 34,
  },
  googleIcon: {
    height: 22,
    marginLeft: 10,
    marginTop: 2,
  },
  wikiIcon: {
    marginRight: 12,
    height: 40,
  },
  arxivIcon: {
    marginRight: 12,
    height: 50,
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
    marginBottom: -14,
  },
  titleText: {
    fontSize: 18,
    wordBreak: "break-all",
    hyphens: "auto",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 32,
  },
  infoTitle: {
    fontSize: 14,
  },
}));

export default function KeywordPane(props) {
  const classes = useStyles();
  const { keywordId } = props;

  const [keyword, setKeyword] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getKeywordInfo() {
      if (keywordId) {
        setLoading(true);

        const keywordInfoUrl = "/keyword?id=" + keywordId;
        let res = await fetch(keywordInfoUrl, {
          method: "GET",
        });
        res = await res.json();

        setKeyword(res);
        setLoading(false);
      }
    }
    getKeywordInfo();
  }, [keywordId]);

  const googleSearchQuery = encodeURIComponent(keyword?.name);
  const googleSearchUrl = "http://www.google.com/search?q=" + googleSearchQuery;

  if (loading)
    return (
      <Box className={classes.container}>
        <div className={classes.loadingContainer}>
          <CircularProgress {...loadingComponentProps} />
        </div>
      </Box>
    );

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
      {keyword.wiki && (
        <div className={classes.infoContainer}>
          <TransparentButton href={keyword.wiki.mainUrl} target="_blank">
            <div className={classes.wikiTitleContainer}>
              <img
                className={classes.wikiIcon}
                src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg"
              />

              <Typography className={classes.infoTitle}>
                <b>Wikipedia</b>
                {keyword.wiki.search ? " (search results)" : " (article)"}
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
                  <li className={classes.infoListItem}>
                    <TransparentButton href={res.url} target="_blank">
                      {res.title}
                    </TransparentButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {keyword.sentences?.length > 0 && (
            <div className={classes.infoContainer}>
              <div className={classes.wikiTitleContainer}>
                <img
                  className={classes.arxivIcon}
                  src="https://storage.scolary.com/storage/file/public/992eb78c-f028-4463-a080-877254c9ec2b.svg"
                />

                <Typography className={classes.infoTitle}>
                  <b>Example usage</b>
                </Typography>
              </div>

              <div className={classes.wikiSummaryContainer}>
                <ul>
                  {keyword.sentences.map((elem) => (
                    <li className={classes.infoListItem}>
                      <TransparentButton
                        linkUnderline="none"
                        href={elem.paper_url}
                        target="_blank"
                      >
                        "{parse(elem.sentence)}"
                      </TransparentButton>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {keyword.definition && (
        <Typography className={classes.infoText}>
          <b>Definition:</b> {keyword.definition}
        </Typography>
      )}
    </Box>
  );
}
