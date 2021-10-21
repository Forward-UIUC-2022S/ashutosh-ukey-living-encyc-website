import { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../Store";

import posTags from "../static/POS-tags.json";

import KeywordChip from "./KeywordChip";
import TransparentButton from "./TransparentButton";

import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";

import ClearIcon from "@mui/icons-material/DoNotDisturbAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { makeStyles } from "@material-ui/core/styles";
import { iconProps } from "../utils";

const FETCH_DELAY = 6;
const POS_DELAY = 3;
const LENGTH_DELAY = 4;
const KWQ_DELAY = 3;

const dropdownIconSize = 30;
const clearIconSize = 19;

const useStyles = makeStyles((theme) => ({
  topBanner: { display: "flex", justifyContent: "space-between" },
  clearButtonText: {
    color: "black",
    marginLeft: 5,
    paddingTop: 2,
  },
  posChipsContainer: {
    marginTop: 8,
  },
  posText: {
    fontSize: 10,
  },
  posChip: {
    display: "inline-block",
    alignSelf: "flex-end",
    border: "2px solid",
    borderRadius: 16,
    padding: "1px 8px",
    paddingRight: 6,
    marginRight: 5,
    marginBottom: 5,
  },
  substrTextContainer: {
    width: "40ch",
    backgroundColor: theme.palette.inputGray.main,
    height: 30,
    fontSize: 14,
    padding: "0px 10px",
  },
  subsectionRoot: {
    marginTop: 14,
  },
  keywordGrid: {
    maxHeight: "16vh",
    overflow: "auto",
    paddingTop: 16,
  },
  leftContainer: {
    flex: 1,
  },
  lengthSelectContainer: {
    marginTop: 4,
  },
  rightContainer: {
    flex: 1,
    marginLeft: "4%",
  },
  searchTitleRoot: {
    display: "flex",
    alignItems: "center",
    marginTop: 8,
  },
  searchTextContainer: {
    width: "100%",
    backgroundColor: theme.palette.inputGray.main,
    height: 34,
  },
  subsectionTitleText: {
    width: 160,
    fontSize: 14,
  },
  searchText: {
    fontSize: 14,
  },
  searchTextField: {
    backgroundColor: theme.palette.inputGray.main,
  },
  titleButton: {
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
  container: {
    display: "flex",
    marginTop: 2,
    border: "1px solid",
    padding: "16px 25px",
  },
  root: {
    marginTop: 8,
    marginLeft: 6,
  },
}));

export default function AdvancedSearch(props) {
  const classes = useStyles();
  const posInputRef = useRef();

  const [state, dispatch] = useContext(Context);
  const { searchKeywords, expandAdvSearch } = state;

  const [caReqController, setCaReqController] = useState();
  const [fetchTimer, setFetchTimer] = useState();

  const [lengthTimer, setLengthTimer] = useState();
  const [posTimer, setPosTimer] = useState();
  const [kwqTimer, setKwqTimer] = useState();

  const [lengthRange, setLengthRange] = useState([0, 100]);
  const [keywordQuery, setKeywordQuery] = useState("");
  const [posPattern, setPosPattern] = useState("");

  const [searchText, setSearchText] = useState("");
  const [clearToggle, setClearToggle] = useState(false);
  const [searchOpts, setSearchOpts] = useState([]);

  function cancelCaRequest() {
    clearTimeout(fetchTimer);
    caReqController?.abort();
  }

  function handleOptsClear() {
    setLengthRange([0, 100]);
    setKeywordQuery("");
    setPosPattern("");
    dispatch({ type: "CLEAR_ADV_SEARCH_OPTS" });
  }

  function createUpdateWithTimeBuffer(
    curTimer,
    updateTimer,
    actionType,
    timeDelay
  ) {
    return (newValue) => {
      clearTimeout(curTimer);
      const timer = setTimeout(() => {
        dispatch({
          type: actionType,
          value: newValue,
        });
      }, timeDelay * 1000);
      updateTimer(timer);
    };
  }

  const updatePosWithDelay = createUpdateWithTimeBuffer(
    posTimer,
    setPosTimer,
    "UPDATE_ADV_SEARCH_POS",
    POS_DELAY
  );
  const updateKwqWithDelay = createUpdateWithTimeBuffer(
    kwqTimer,
    setKwqTimer,
    "UPDATE_LABEL_SEARCH_QUERY",
    KWQ_DELAY
  );
  const updateLengthWithDelay = createUpdateWithTimeBuffer(
    lengthTimer,
    setLengthTimer,
    "UPDATE_ADV_SEARCH_LRANGE",
    LENGTH_DELAY
  );

  useEffect(() => {
    async function getKeywordOpts() {
      const searchKeywordsUrl = `/keywords?query=${searchText}`;
      let res = await fetch(searchKeywordsUrl, {
        method: "GET",
      });
      res = await res.json();

      setSearchOpts(res);
    }

    // Don't get common attrs until user is done typing
    if (searchText.length > 0) cancelCaRequest();
    getKeywordOpts();
  }, [searchText]);

  useEffect(() => {
    async function getCommonAttrs(controller) {
      if (searchKeywords.length > 0) {
        let keywordsIdsUri = searchKeywords.map((e) => e.id).join(",");
        const searchKeywordsUrl = `/keywords/common-attrs?ids=${keywordsIdsUri}`;
        let res = await fetch(searchKeywordsUrl, {
          signal: controller.signal,
          method: "GET",
        });
        res = await res.json();

        if (res.nameQuery) setKeywordQuery(res.nameQuery);
        if (res.posPattern) setPosPattern(res.posPattern);
        if (res.lengthRange) setLengthRange(res.lengthRange);

        dispatch({
          type: "UPDATE_ADV_SEARCH_OPTS",
          value: res,
        });
      }
    }

    // Make request with some time buffer for input changes
    cancelCaRequest();
    const controller = new AbortController();
    const timer = setTimeout(
      () => getCommonAttrs(controller),
      FETCH_DELAY * 1000
    );

    setCaReqController(controller);
    setFetchTimer(timer);

    return () => cancelCaRequest();
  }, [searchKeywords]);

  function handlePosClick(tag) {
    const cursorPos = posInputRef?.current.selectionStart;

    const newPosPattern =
      posPattern.substring(0, cursorPos) +
      `<${tag}>` +
      posPattern.substring(cursorPos);

    setPosPattern(newPosPattern);

    posInputRef.current?.focus();
    // const newPos = cursorPos + tag.length;
    // posInputRef.current?.setSelectionRange(newPos, newPos);
  }

  function handleKeywordAdd(keyword) {
    if (keyword) {
      dispatch({
        type: "ADD_SEARCH_KEYWORD",
        keyword: keyword,
      });

      // Force clear Autocomplete display input
      setClearToggle(!clearToggle);
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.topBanner}>
        <TransparentButton
          onClick={() => dispatch({ type: "TOGGLE_ADV_SEARCH" })}
          className={classes.titleButton}
          linkUnderline="none"
        >
          <Typography>Advanced Search</Typography>
          {expandAdvSearch ? (
            <ArrowDropUpIcon {...iconProps(dropdownIconSize)} />
          ) : (
            <ArrowDropDownIcon {...iconProps(dropdownIconSize)} />
          )}
        </TransparentButton>

        {expandAdvSearch && (
          <IconButton
            onClick={handleOptsClear}
            classes={{ root: classes.titleButton }}
          >
            <ClearIcon {...iconProps(clearIconSize)} />
            <Typography className={classes.clearButtonText}>Clear</Typography>
          </IconButton>
        )}
      </div>
      {expandAdvSearch && (
        <div className={classes.container}>
          <div className={classes.leftContainer}>
            <div className={classes.searchTitleRoot}>
              <Typography className={classes.subsectionTitleText}>
                <b>Input keywords:</b>
              </Typography>
              <Autocomplete
                key={clearToggle}
                filterSelectedOptions
                classes={{
                  input: classes.searchText,
                  option: classes.searchText,
                  root: classes.searchTextContainer,
                  inputRoot: classes.searchTextContainer,
                }}
                size="small"
                inputValue={searchText}
                onChange={(_, newValue) => handleKeywordAdd(newValue)}
                options={searchOpts}
                onInputChange={(_, newValue) => {
                  setSearchText(newValue);
                }}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
              />
            </div>

            <div className={classes.keywordGrid}>
              {searchKeywords.map((kwd) => (
                <KeywordChip key={kwd.id} keyword={kwd} />
              ))}
            </div>
          </div>

          <div className={classes.rightContainer}>
            <div className={classes.lengthSelectContainer}>
              <Typography className={classes.subsectionTitleText}>
                <b>Keyword length:</b>
              </Typography>
              <Slider
                size="small"
                // getAriaLabel={() => "Length range"}
                value={lengthRange}
                onChange={(_, newValue) => setLengthRange(newValue)}
                valueLabelDisplay="auto"
                max={100}
                // getAriaValueText={(value) => `${value} chars`}
              />
            </div>
            <div className={classes.subsectionRoot}>
              <Typography className={classes.subsectionTitleText}>
                <b>Common substring:</b>
              </Typography>
              <TextField
                InputProps={{ classes: { input: classes.substrTextContainer } }}
                onChange={(e) => setKeywordQuery(e.target.value)}
                value={keywordQuery}
                variant="outlined"
              />
            </div>
            <div className={classes.subsectionRoot}>
              <Typography className={classes.subsectionTitleText}>
                <b>POS pattern:</b>
              </Typography>
              <TextField
                onChange={(e) => setPosPattern(e.target.value)}
                value={posPattern}
                inputRef={posInputRef}
                InputProps={{ classes: { input: classes.substrTextContainer } }}
                variant="outlined"
              />
            </div>

            <div className={classes.posChipsContainer}>
              {posTags.map((e, idx) => (
                <IconButton
                  key={idx}
                  style={{ padding: 0 }}
                  onClick={() => handlePosClick(e.symbol)}
                >
                  <div className={classes.posChip}>
                    <Typography className={classes.posText}>
                      {"<" + e.symbol + ">"}
                    </Typography>
                  </div>
                </IconButton>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
