import { useState, useEffect, useContext } from "react";
import { Context } from "../Store";

import { tabToLabelType } from "../utils";

import KeywordTable from "./KeywordTable";
import AdvancedSearch from "./AdvancedSearch";

import { Box, TextField, Typography } from "@material-ui/core";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import { DataGrid } from "@material-ui/data-grid";

import { makeStyles } from "@material-ui/core/styles";

const FETCH_DELAY = 5;

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 3.5,
    marginTop: 20,
  },
  tableTitleText: {
    marginRight: 35,
  },
  tableTitleContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 24,
  },
  tableHead: {
    display: "none",
    background: theme.palette.pendingYellow.main,
    width: "100%",
    marginTop: 87,
    height: 39,
    position: "absolute",
  },
  tableContainer: {
    // position: "relative",
    display: "flex",
    flexDirection: "column",
    // height: 600,
    marginBottom: 100,
  },
  searchFieldInput: {
    background: theme.palette.inputGray.main,
    height: 5,
  },
  searchFieldContainer: {
    width: "100%",
    background: theme.palette.inputGray.main,
  },
  dataRow: {
    background: "white",
  },
}));

const columns = [
  {
    field: "name",
    headerName: "Keyword",
    width: 400,
    editable: false,
  },
];

export default function SearchSelectPane(props) {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const { refresh, ButtonsComponent } = props;

  const { advSearchOpts, curVerifyTab } = state;

  const [query, setQuery] = useState("");
  const [searchTimer, setSearchTimer] = useState();
  const [keywordOpts, setKeywordOpts] = useState([]);
  const [keywordsIndex, setKeywordsIndex] = useState({});

  useEffect(() => {
    async function getOpts() {
      const labelType = tabToLabelType[curVerifyTab];
      let getOptsUrl = `/labeler/${labelType}s`;

      const { nameQuery, posPattern, lengthRange } = advSearchOpts;

      const queryParams = [];
      if (nameQuery?.length > 0) queryParams.push("nameQuery=" + nameQuery);
      if (posPattern?.length > 0) queryParams.push("posPattern=" + posPattern);
      if (typeof lengthRange?.[0] === "number")
        queryParams.push("minLegth=" + lengthRange[0]);
      if (typeof lengthRange?.[1] === "number")
        queryParams.push("maxLegth=" + lengthRange[1]);

      if (queryParams.length > 0) getOptsUrl += "?" + queryParams.join("&");
      let res = await fetch(getOptsUrl);
      res = await res.json();
      setKeywordOpts(res);

      const newIndex = {};
      for (let kwd of res) {
        newIndex[kwd.id] = kwd;
      }
      setKeywordsIndex(newIndex);
    }

    getOpts();
  }, [advSearchOpts, refresh, curVerifyTab]);

  /*
  useEffect(() => {
    function updateStoreQuery() {
      dispatch({
        type: "UPDATE_LABEL_SEARCH_QUERY",
        value: query,
      });
    }

    // Add delay before making request
    clearTimeout(searchTimer);
    const timer = setTimeout(updateStoreQuery, FETCH_DELAY * 1000);
    setSearchTimer(timer);
  }, [query]);
  */

  function handleQueryChange(newQuery) {
    setQuery(newQuery);

    clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      dispatch({
        type: "UPDATE_LABEL_SEARCH_QUERY",
        value: newQuery,
      });
    }, FETCH_DELAY * 1000);
    setSearchTimer(timer);
  }

  return (
    <div className={classes.container}>
      {/*<Autocomplete
        classes={{
          root: classes.searchFieldContainer,
          input: classes.searchFieldInput,
        }}
        freeSolo
        options={[]}
        renderInput={(params) => (
          <TextField
            {...params}
            defaultValue={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            variant="outlined"
            placeholder="Search keywords"
          />
        )}
        />*/}
      <TextField
        size="small"
        className={classes.searchFieldContainer}
        defaultValue={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        variant="outlined"
        placeholder="Search keywords"
      />
      <AdvancedSearch />
      <Box className={classes.tableContainer}>
        <div className={classes.tableTitleContainer}>
          <Typography className={classes.tableTitleText} variant="h5">
            Select Keywords
          </Typography>
          {ButtonsComponent ? <ButtonsComponent /> : null}
        </div>
        {/* Below element colors table head row */}
        {/* <div className={classes.tableHead}></div> */}
        {<KeywordTable dataRows={keywordOpts} />}
        {/*
          <DataGrid
            rows={keywordOpts}
            columns={columns}
            selectionModel={selectedKeywordIds}
            onSelectionModelChange={onKeywordsSelect}
            density="compact"
            checkboxSelection
            disableSelectionOnClick
          />
        */}
      </Box>
    </div>
  );
}
