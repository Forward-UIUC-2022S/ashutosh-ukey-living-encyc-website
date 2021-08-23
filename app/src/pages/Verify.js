import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import { Box, Paper, TextField, Typography } from "@material-ui/core";
import Button from "../components/Button";
import Table from "../components/PreselectTable";

import useStyles from "./VerifyStyles";

function Topic() {
  // The <Route> that rendered this component has a
  // path of `/topics/:topicId`. The `:topicId` portion
  // of the URL indicates a placeholder that we can
  // get from `useParams()`.
  let { topicId } = useParams();

  return (
    <div>
      <h3>{topicId}</h3>
    </div>
  );
}

function SideMenu() {
  const { url } = useRouteMatch();
  const classes = useStyles();

  const sideMenuOpts = [
    { name: "Upload New", href: `${url}/upload` },
    { name: "Relevance", href: `${url}/relevance` },
    { name: "Generated Info", href: `${url}/generated` },
    { name: "Settings", href: `${url}/settings` },
  ];

  return (
    <Box className={classes.sideContainer}>
      {sideMenuOpts.map((opt) => (
        <Button
          clickedClassName={classes.sideButtonClicked}
          unclickedClassName={classes.sideButtonUnclicked}
          size="small"
          name={opt.name}
          href={opt.href}
        />
      ))}
    </Box>
  );
}

function Verify() {
  const { path } = useRouteMatch();
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <SideMenu />
      <Switch>
        <Route exact path={`${path}/relevance`}>
          <PreselectSection />
        </Route>
        <Route path={`${path}/relevance/:keywordId`}>
          <VerifyKeywordDomain />
        </Route>
      </Switch>
    </Box>
  );
}

function PreselectSection() {
  const classes = useStyles();

  const [query, setQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  return (
    <Box className={classes.preselectContainer}>
      <Table />
      <Button
        unclickedClassName={classes.continueButton}
        size="small"
        name="Continue to verify"
      />
    </Box>
  );
}

function VerifyKeywordDomain() {
  let { keywordId } = useParams();
  const classes = useStyles();

  return (
    <Box className={classes.verifyContainer}>
      <Box className={classes.keywordDomainCard}>
        <h3>Keyword id: {keywordId}</h3>
      </Box>
      <Box className={classes.classifyContainer}>
        <Button
          unclickedClassName={classes.correctButton}
          size="small"
          name="Relevant"
        />
        <Button
          unclickedClassName={classes.incorrectButton}
          size="small"
          name="Irrelevant"
        />
      </Box>
    </Box>
  );
}

export default Verify;
