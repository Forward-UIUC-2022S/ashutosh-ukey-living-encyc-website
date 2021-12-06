import { useState, useEffect, useContext } from "react";
import { Context } from "../Store";

import { TextField, Typography } from "@material-ui/core";
import KeywordDisplayChip from "../components/KeywordDisplayChip";

// import Grid from "@mui/material/Grid";
import useStyles from "./SearchStyles";
import { fetchApi } from "../utils";

export default function Home() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);

  const { displayKeywordQuery } = state;
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (displayKeywordQuery) setQuery(displayKeywordQuery);
  }, []);

  useEffect(() => {
    async function getEntityOptions(queryText) {
      const entityLink = `/keywords?isForDisplay=1&query=${queryText}`;
      let res = await fetchApi(entityLink);
      res = await res.json();
      setSearchResults(res);
    }

    getEntityOptions(query);
  }, [query]);

  function storeSearchQuery() {
    dispatch({
      type: "SET_KEYWORD_DISPLAY_QUERY",
      value: query,
    });
  }

  return (
    <div className={classes.container}>
      <div className={classes.optionsContainer}>
        <Typography className={classes.searchTitle}>
          <b>Search Keywords</b>
        </Typography>
      </div>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.searchInput}
          defaultValue={query}
          onChange={(event) => setQuery(event.target.value)}
          variant="outlined"
        />
      </div>
      <div className={classes.keywordChipsContainer}>
        {searchResults.map((e) => (
          <div style={{ margin: 10 }} onClick={storeSearchQuery}>
            <KeywordDisplayChip keyword={e} />
          </div>
        ))}
      </div>
    </div>
  );
}
