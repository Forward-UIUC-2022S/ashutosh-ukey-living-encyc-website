import { useState, useEffect, useContext } from "react";
import { Context } from "../Store";

import { Box, Paper, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DataGrid } from "@material-ui/data-grid";

import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  tableHead: {
    background: theme.palette.pendingYellow.main,
    width: "100%",
    marginTop: 107,
    height: 39,
    position: "absolute",
  },
  tableContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: 600,
    marginBottom: 100,
  },
  searchFieldInput: {
    background: theme.palette.inputGray.main,
    height: 5,
  },
  searchFieldContainer: {
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

const rows = [
  { id: 2, keyword: "data mining" },
  { id: 3, keyword: "artificial intelligence" },
];

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function PreselectTable(props) {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const { refresh, displayStatus, ButtonsComponent } = props;

  const { selectedKeywordIds } = state;

  const [query, setQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [keywordOpts, setKeywordOpts] = useState([]);

  useEffect(() => {
    async function getOpts() {
      let getOptsUrl = "/label/pending?status=" + displayStatus;

      if (query) getOptsUrl += "&query=" + query;

      let res = await fetch(getOptsUrl);
      res = await res.json();

      setKeywordOpts(res);
    }

    getOpts();
  }, [query, refresh]);

  function onKeywordsSelect(newSelectionModel) {
    dispatch({
      type: "UPDATE_SELECTED_KEYWORDS",
      keywordIds: newSelectionModel,
    });
  }

  return (
    <div>
      <Autocomplete
        classes={{
          root: classes.searchFieldContainer,
          input: classes.searchFieldInput,
        }}
        freeSolo
        options={searchSuggestions.map((option) => option.name)}
        // className={classes.searchFieldContainer}
        renderInput={(params) => (
          <TextField
            {...params}
            defaultValue={query}
            onChange={(event) => setQuery(event.target.value)}
            variant="outlined"
            placeholder="Search keywords"
          />
        )}
      />
      <Box className={classes.tableContainer}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 50,
            marginBottom: 20,
          }}
        >
          <Typography style={{ marginRight: 50 }} variant="h5">
            Select Keywords
          </Typography>
          <ButtonsComponent />
        </div>
        {/* Below element colors table head row */}
        {<div className={classes.tableHead}></div>}
        <DataGrid
          rows={keywordOpts}
          columns={columns}
          selectionModel={selectedKeywordIds}
          onSelectionModelChange={onKeywordsSelect}
          density="compact"
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}
