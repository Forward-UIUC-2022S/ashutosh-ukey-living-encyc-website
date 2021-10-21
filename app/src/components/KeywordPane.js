// TODO: Add tooltips for each keyword category
import parse from "html-react-parser";
import { useEffect, useState, useContext } from "react";
import { Context } from "../Store";

import Button from "../components/Button";
import TransparentButton from "./TransparentButton";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DictionaryIcon from "@mui/icons-material/MenuBook";

import Checkbox from "@mui/material/Checkbox";
import { Box, Typography, Icon } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import { iconProps, staticButtonColorStyle } from "../utils";

const loadingComponentProps = {
  size: 50,
  thickness: 2.8,
};

const closeIconSize = 24;
const dictIconSize = 45;

const verifyButtonStyles = {
  padding: 0,
  maxWidth: 200,
  border: "2px solid",
  borderRadius: 10,
  marginRight: 10,
};

const useStyles = makeStyles((theme) => ({
  markButtonsContainer: {
    display: "flex",
    alignItems: "center",
  },
  disabledButton: {
    ...verifyButtonStyles,
    ...staticButtonColorStyle(theme.palette.backGray.main),
    pointerEvents: "none",
  },
  allCorrectButton: {
    ...verifyButtonStyles,
    ...staticButtonColorStyle(theme.palette.verifyGreen.main),
  },
  allIncorrectButton: {
    ...verifyButtonStyles,
    ...staticButtonColorStyle(theme.palette.verifyRed.main),
  },
  closeIconButton: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: -20,
    marginRight: -5,
    marginBottom: -20,
  },
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
  infoTitleContainer: {
    display: "flex",
    alignItems: "center",
  },
  wikiSummaryText: {
    fontSize: 12,
  },
  infoBodyContainer: {
    marginTop: 8,
    maxHeight: 175,
    overflowY: "scroll",
    overflowX: "hidden",
    paddingRight: 4,
  },
  container: {
    maxWidth: 280,
    backgroundColor: theme.palette.backGray.main,
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
    maxWidth: 180,
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
  const [state, dispatch] = useContext(Context);
  const { keywordIdInfoPane: keywordId, curVerifyTab } = state;

  const showDefinitions = curVerifyTab === "definition" && true;
  const showTutorials = curVerifyTab === "tutorial";

  const [infoReqController, setInfoReqController] = useState();

  const [enableButtons, setEnableButtons] = useState(true);
  const [keyword, setKeyword] = useState();
  const [loading, setLoading] = useState(false);

  function handleClose() {
    setKeyword(null);
    dispatch({ type: "CLEAR_KEYWORD_INFO_ID" });
  }

  useEffect(() => {
    async function getKeywordInfo(controller) {
      if (typeof keywordId === "number") {
        setLoading(true);

        const keywordInfoUrl = "/keywords/" + keywordId;
        let res = await fetch(keywordInfoUrl, {
          method: "GET",
          signal: controller.signal,
        });
        res = await res.json();

        setKeyword(res);
        setLoading(false);
      }
    }

    // Delete previous info request when clicking on a new keyword
    infoReqController?.abort();
    const controller = new AbortController();
    getKeywordInfo(controller);
    setInfoReqController(controller);

    return () => infoReqController?.abort();
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

  const LabelButtons = () => (
    <div className={classes.markButtonsContainer}>
      <Button
        name="Mark Relevant"
        onClick={() => console.log("Hello")}
        unclickedClassName={
          enableButtons ? classes.allCorrectButton : classes.disabledButton
        }
        labelStyleName={classes.buttonText}
        size="small"
      />
      <Button
        name="Mark Irrelevant"
        onClick={() => console.log("World")}
        unclickedClassName={
          enableButtons ? classes.allIncorrectButton : classes.disabledButton
        }
        labelStyleName={classes.buttonText}
        size="small"
      />
    </div>
  );

  return !keyword ? null : (
    <Box className={classes.container}>
      <div className={classes.closeIconButton}>
        <IconButton onClick={handleClose}>
          <CloseIcon {...iconProps(closeIconSize)} />
        </IconButton>
      </div>
      <div className={classes.titleContainer}>
        <Typography className={classes.titleText}>{keyword.name}</Typography>
        <TransparentButton href={googleSearchUrl} target="_blank">
          <img
            className={classes.googleIcon}
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          />
        </TransparentButton>
      </div>
      {showDefinitions && (
        <div className={classes.infoContainer}>
          <div className={classes.infoTitleContainer}>
            <DictionaryIcon
              {...iconProps(dictIconSize)}
              style={{ marginRight: 10 }}
            />

            <Typography className={classes.infoTitle}>
              <b>Definitions</b>
            </Typography>
          </div>

          <div className={classes.infoBodyContainer}>
            {keyword.sentences.map((elem, idx) => (
              <div
                key={idx}
                style={{ display: "flex", alignItems: "flex-start" }}
              >
                <Checkbox style={{ padding: 0, paddingRight: 15 }} />
                <Typography className={classes.infoListItem}>
                  "{parse(elem.sentence)}"
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
      {keyword.wiki && (
        <div className={classes.infoContainer}>
          <TransparentButton href={keyword.wiki.mainUrl} target="_blank">
            <div className={classes.infoTitleContainer}>
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

          <div className={classes.infoBodyContainer}>
            {keyword.wiki.summary && (
              <Typography className={classes.wikiSummaryText}>
                {keyword.wiki.summary}
              </Typography>
            )}
            {keyword.wiki.search && (
              <ul>
                {keyword.wiki.search.map((res, idx) => (
                  <li key={idx} className={classes.infoListItem}>
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
              <div className={classes.infoTitleContainer}>
                <img
                  className={classes.arxivIcon}
                  src="https://storage.scolary.com/storage/file/public/992eb78c-f028-4463-a080-877254c9ec2b.svg"
                />

                <Typography className={classes.infoTitle}>
                  <b>Example usage</b>
                </Typography>
              </div>

              <div className={classes.infoBodyContainer}>
                <ul>
                  {keyword.sentences.map((elem, idx) => (
                    <li key={idx} className={classes.infoListItem}>
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
    </Box>
  );
}
