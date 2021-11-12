// TODO: Add tooltips for each keyword category
import parse from "html-react-parser";
import { useEffect, useState, useContext, useRef } from "react";
import { Context } from "../Store";

import Button from "../components/Button";
import TransparentButton from "./TransparentButton";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DictionaryIcon from "@mui/icons-material/MenuBook";
import TutorialIcon from "@mui/icons-material/Book";

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
  buttonText: {
    fontSize: 10,
    padding: "2px 8px",
  },
  markButtonsContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 15,
  },
  disabledButton: {
    ...verifyButtonStyles,
    ...staticButtonColorStyle(theme.palette.backGray.dark),
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
    maxWidth: 185,
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

  const [loading, setLoading] = useState(false);
  const [infoReqController, setInfoReqController] = useState();

  const [keyword, setKeyword] = useState();

  // For tutorial and definition labeling
  const showDefinitions = curVerifyTab === "definition";
  const showTutorials = curVerifyTab === "tutorial";

  const [definitions, setDefinitions] = useState();
  const [selectedDefinitionIds, setSelectedDefinitionIds] = useState([]);

  const [tutorials, setTutorials] = useState();
  const [selectedTutorialIds, setSelectedTutorialIds] = useState([]);

  const defContainerRef = useRef(null);
  const [defContScrollOffset, setDefContScrollOffset] = useState(0);

  const tutContainerRef = useRef(null);
  const [tutContScrollOffset, setTutContScrollOffset] = useState(0);

  function handleDefinitionCheck(checked, definitionId) {
    setDefContScrollOffset(defContainerRef.current?.scrollTop);

    let newSelectedDefinitionIds = [...selectedDefinitionIds];
    if (checked) newSelectedDefinitionIds.push(definitionId);
    else
      newSelectedDefinitionIds = newSelectedDefinitionIds.filter(
        (item) => item !== definitionId
      );

    setSelectedDefinitionIds(newSelectedDefinitionIds);
    console.log(newSelectedDefinitionIds);
  }

  function handleTutorialCheck(checked, tutorialId) {
    setTutContScrollOffset(tutContainerRef.current?.scrollTop);

    let newSelectedTutorialIds = [...selectedTutorialIds];
    if (checked) newSelectedTutorialIds.push(tutorialId);
    else
      newSelectedTutorialIds = newSelectedTutorialIds.filter(
        (item) => item !== tutorialId
      );

    setSelectedTutorialIds(newSelectedTutorialIds);
    console.log(newSelectedTutorialIds);
  }

  function postLabelCleanup(labelIds) {
    // Nothing to label for current keyword
    if (labelIds.length === 0) {
      dispatch({ type: "REMOVE_KEYWORD_TABLE_OPT", keywordId: keywordId });
      handleClose();
    }
    dispatch({ type: "REFRESH_USER_STATS" });
  }

  async function markDefinitions(label) {
    const labelUrl = `/labeler/definitions/mark?label=${label}`;
    let res = await fetch(labelUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedDefinitionIds),
    });
    res = await res.json();

    console.log("Definiton label return request: ", res);
    if (res.numAffected !== selectedDefinitionIds.length)
      console.log("Warning: failed to label all definitions");
    else {
      setSelectedDefinitionIds([]);

      let newDefinitions = definitions.filter(
        (def) => !selectedDefinitionIds.includes(def.id)
      );
      setDefinitions(newDefinitions);
      postLabelCleanup(newDefinitions);
    }

    return res;
  }

  async function markTutorials(label) {
    const labelUrl = `/labeler/tutorials/mark?label=${label}`;
    let res = await fetch(labelUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedTutorialIds),
    });
    res = await res.json();

    console.log("Tutorial label return request: ", res);
    if (res.numAffected !== selectedTutorialIds.length)
      console.log("Warning: failed to label all tutorials");
    else {
      setSelectedTutorialIds([]);

      let newTutorials = tutorials.filter(
        (tut) => !selectedTutorialIds.includes(tut.id)
      );
      setTutorials(newTutorials);
      postLabelCleanup(newTutorials);
    }

    return res;
  }

  // Hide KeywordPane
  function handleClose() {
    setKeyword(null);
    dispatch({ type: "CLEAR_KEYWORD_INFO_ID" });
  }

  // Keep same scroll offset on re-render
  useEffect(() => {
    if (defContainerRef.current)
      defContainerRef.current.scrollTop = defContScrollOffset;
  }, [defContainerRef.current]);

  useEffect(() => {
    if (tutContainerRef.current)
      tutContainerRef.current.scrollTop = tutContScrollOffset;
  }, [tutContainerRef.current]);

  // Fetch keyword-specific labeling entities and info
  useEffect(() => {
    async function getKeywordInfo(controller) {
      if (typeof keywordId === "number") {
        setLoading(true);

        let keywordInfoUrl = "/keywords/" + keywordId;

        let res = await fetch(keywordInfoUrl, {
          method: "GET",
          signal: controller.signal,
        });
        res = await res.json();

        setKeyword(res);
        setLoading(false);
      }
    }

    async function getKeywordDefinitions(controller) {
      setSelectedDefinitionIds([]);
      if (typeof keywordId === "number") {
        let keywordDefinitionsUrl = `/labeler/keyword/${keywordId}/definitions`;

        let res = await fetch(keywordDefinitionsUrl, {
          method: "GET",
          signal: controller.signal,
        });
        res = await res.json();

        setDefinitions(res);
        console.log("Definitions: ", res);
      }
    }

    async function getKeywordTutorials(controller) {
      setSelectedTutorialIds([]);
      if (typeof keywordId === "number") {
        let keywordTutorialsUrl = `/labeler/keyword/${keywordId}/tutorials`;

        let res = await fetch(keywordTutorialsUrl, {
          method: "GET",
          signal: controller.signal,
        });
        res = await res.json();

        setTutorials(res);
        console.log("Tutorials: ", res);
      }
    }

    // Delete previous info request when clicking on a new keyword
    infoReqController?.abort();
    const controller = new AbortController();
    getKeywordInfo(controller);
    if (showDefinitions) getKeywordDefinitions(controller);
    if (showTutorials) getKeywordTutorials(controller);
    setInfoReqController(controller);

    setDefinitions(null);
    setSelectedDefinitionIds([]);

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

  // Label buttons for keyword-specific label entities
  const LabelButtons = (props) => {
    const { enableButtons, onGoodClick, onBadClick } = props;

    return (
      <div className={classes.markButtonsContainer}>
        <Button
          name="Mark Good"
          onClick={onGoodClick}
          unclickedClassName={
            enableButtons ? classes.allCorrectButton : classes.disabledButton
          }
          labelStyleName={classes.buttonText}
          size="small"
        />
        <Button
          name="Mark Bad"
          onClick={onBadClick}
          unclickedClassName={
            enableButtons ? classes.allIncorrectButton : classes.disabledButton
          }
          labelStyleName={classes.buttonText}
          size="small"
        />
      </div>
    );
  };

  const DefinitionLabelSection = () => (
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

      <div ref={defContainerRef} className={classes.infoBodyContainer}>
        {definitions.map((elem) => (
          <div
            key={elem.id}
            style={{ display: "flex", alignItems: "flex-start" }}
          >
            <Checkbox
              style={{ padding: 0, paddingRight: 15 }}
              checked={selectedDefinitionIds.includes(elem.id)}
              onChange={(event) =>
                handleDefinitionCheck(event.target.checked, elem.id)
              }
            />
            <Typography className={classes.infoListItem}>
              {elem.content}
            </Typography>
          </div>
        ))}
      </div>

      <LabelButtons
        enableButtons={selectedDefinitionIds.length > 0}
        onGoodClick={() => markDefinitions("good")}
        onBadClick={() => markDefinitions("bad")}
      />
    </div>
  );

  const TutorialLabelSection = () => (
    <div className={classes.infoContainer}>
      <div className={classes.infoTitleContainer}>
        <TutorialIcon
          {...iconProps(dictIconSize)}
          style={{ marginRight: 10 }}
        />

        <Typography className={classes.infoTitle}>
          <b>Tutorials</b>
        </Typography>
      </div>

      <div ref={tutContainerRef} className={classes.infoBodyContainer}>
        {tutorials.map((elem) => (
          <div
            key={elem.id}
            style={{ display: "flex", alignItems: "flex-start" }}
          >
            <Checkbox
              style={{ padding: 0, paddingRight: 15 }}
              checked={selectedTutorialIds.includes(elem.id)}
              onChange={(event) =>
                handleTutorialCheck(event.target.checked, elem.id)
              }
            />
            <Typography className={classes.infoListItem}>
              <b>{elem.title}</b>, {elem.year}
            </Typography>
          </div>
        ))}
      </div>

      <LabelButtons
        enableButtons={selectedTutorialIds.length > 0}
        onGoodClick={() => markTutorials("good")}
        onBadClick={() => markTutorials("bad")}
      />
    </div>
  );

  const showInfo = typeof keywordId === "number" && keyword;

  return !showInfo ? null : (
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
      {showDefinitions && definitions && <DefinitionLabelSection />}
      {showTutorials && tutorials && <TutorialLabelSection />}
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
