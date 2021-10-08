import { useState, useContext, useEffect } from "react";
import { Context } from "../Store";

import KeywordChip from "./KeywordChip";
import TransparentButton from "./TransparentButton";

import Slider from "@mui/material/Slider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { makeStyles } from "@material-ui/core/styles";

const dropdownIconSize = 30;

const useStyles = makeStyles((theme) => ({
  substrTextContainer: {
    width: "40ch",
    backgroundColor: theme.palette.inputGray.main,
    height: 30,
    fontSize: 14,
    padding: "0px 10px",
  },
  subsectionRoot: {
    width: "80%",
    alignItems: "center",
    marginTop: 14,
  },
  keywordGrid: {
    maxHeight: "16vh",
    overflow: "auto",
    paddingTop: 16,
  },
  leftContainer: {
    width: "40%",
  },
  rightContainer: {
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "flex-start",
    width: "40%",
    flex: 1,
    marginLeft: 50,
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
    width: 180,
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
    color: "black",
  },
  container: {
    display: "flex",
    flexBasis: "50%",
    marginTop: 2,
    border: "1px solid",
    padding: "16px 25px",
    paddingBottom: 5,
  },
  root: {
    marginTop: 12,
    marginLeft: 6,
  },
}));

export default function AdvancedSearch(props) {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const { searchKeywords } = state;

  const [expanded, setExpanded] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [clearToggle, setClearToggle] = useState(false);
  const [searchOpts, setSearchOpts] = useState([]);

  const [lengthRange, setLengthRange] = useState([0, 100]);

  const iconProps = {
    sx: { fontSize: dropdownIconSize },
  };

  useEffect(() => {
    async function searchKeywords() {
      const searchKeywordsUrl = `/keyword/search/?query=${searchText}`;
      let res = await fetch(searchKeywordsUrl, {
        method: "GET",
      });
      res = await res.json();

      setSearchOpts(res);
    }

    searchKeywords();
  }, [searchText]);

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
      <TransparentButton
        onClick={() => setExpanded(!expanded)}
        className={classes.titleButton}
        linkUnderline="none"
      >
        <Typography>Advanced Search</Typography>
        {expanded ? (
          <ArrowDropUpIcon {...iconProps} />
        ) : (
          <ArrowDropDownIcon {...iconProps} />
        )}
      </TransparentButton>
      {expanded && (
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
            <div className={classes.subsectionRoot}>
              <Typography className={classes.subsectionTitleText}>
                <b>Keyword length:</b>
              </Typography>
              <Slider
                size="small"
                getAriaLabel={() => "Length range"}
                value={lengthRange}
                onChange={(_, newValue) => setLengthRange(newValue)}
                valueLabelDisplay="auto"
                getAriaValueText={(value) => `${value} chars`}
              />
            </div>
            <div className={classes.subsectionRoot}>
              <Typography className={classes.subsectionTitleText}>
                <b>Common substring:</b>
              </Typography>
              <TextField
                InputProps={{ classes: { input: classes.substrTextContainer } }}
                variant="outlined"
              />
            </div>
            <div className={classes.subsectionRoot}>
              <Typography className={classes.subsectionTitleText}>
                <b>POS pattern:</b>
              </Typography>
              <TextField
                InputProps={{ classes: { input: classes.substrTextContainer } }}
                variant="outlined"
              />
            </div>
            <div
              style={
                {
                  // width: "100%",
                  // dislay: "flex",
                }
              }
            >
              <div
                style={{
                  display: "inline-block",
                  alignSelf: "flex-end",
                  border: "2px solid",
                  borderRadius: 16,
                  padding: "1px 8px",
                  paddingRight: 6,
                  marginRight: 5,
                  marginBottom: 5,
                }}
              >
                <Typography className={classes.text}>{"<NOUN>"}</Typography>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
