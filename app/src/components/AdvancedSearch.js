import { useState, useContext, useEffect } from "react";
import { Context } from "../Store";

import KeywordChip from "./KeywordChip";
import TransparentButton from "./TransparentButton";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const dropdownIconSize = 30;

const useStyles = makeStyles((theme) => ({
  keywordGrid: {
    maxHeight: "16vh",
    overflow: "auto",
    paddingTop: 16,
  },
  leftContainer: {
    width: "40%",
  },
  searchTitleRoot: {
    display: "flex",
    alignItems: "center",
  },
  searchTextContainer: {
    width: "100%",
    backgroundColor: theme.palette.inputGray.main,
    height: 34,
  },
  searchTitleText: {
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
    height: "100%",
    marginTop: 2,
    border: "1px solid",
    padding: "16px 25px",
    paddingBottom: 5,
  },
  root: {
    height: "25vh",
    marginTop: 12,
    marginLeft: 6,
    marginBottom: 10,
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
      <div className={classes.container}>
        <div className={classes.leftContainer}>
          <div className={classes.searchTitleRoot}>
            <Typography className={classes.searchTitleText}>
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
      </div>
    </div>
  );
}
