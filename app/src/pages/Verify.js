import { useState, useEffect, useContext } from "react";
import { Context } from "../Store";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

import AdminSection from "./Admin";

import { Box, Paper, TextField, Typography } from "@material-ui/core";

import Button from "../components/Button";
import KeywordPane from "../components/KeywordPane";
import PrivateRoute from "../components/PrivateRoute";
import PreselectTable from "../components/PreselectTable";

import useStyles from "./VerifyStyles";

function Verify() {
  const { path } = useRouteMatch();
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <SideMenu />
      <Switch>
        <Route path={`${path}/relevance`} component={DomainVerifySection} />
        <PrivateRoute
          path={`${path}/admin`}
          component={AdminSection}
          requireAdmin={true}
        />
      </Switch>
    </Box>
  );
}

function SideMenu() {
  const [state, dispatch] = useContext(Context);
  const { isAdmin } = state;

  const { url } = useRouteMatch();
  const classes = useStyles();

  const sideMenuOpts = [
    { name: "Admin", href: `${url}/admin`, requireAdmin: true },
    { name: "Domain Relevance", href: `${url}/relevance` },
    { name: "Generated Definitions", href: `${url}/definition` },
    { name: "Tutorials & Surveys", href: `${url}/learn` },
    { name: "Settings", href: `${url}/settings` },
  ];

  return (
    <Box className={classes.sideContainer}>
      {sideMenuOpts.map(
        (opt, idx) =>
          (!opt.requireAdmin || isAdmin) && (
            <Button
              key={idx}
              clickedClassName={classes.sideButtonClicked}
              unclickedClassName={classes.sideButtonUnclicked}
              size="small"
              name={opt.name}
              href={opt.href}
            />
          )
      )}
    </Box>
  );
}

async function markSelected(selectedKeywordIds, curStatus, label) {
  const labelUrl = `/label?fromStatus=${curStatus}&label=${label}`;

  let res = await fetch(labelUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedKeywordIds),
  });
  res = await res.json();

  console.log("Label return request: ", res);
  if (res.numAffected !== selectedKeywordIds.length)
    console.log("Warning: failed to label all keywords");

  return res;
}

function DomainVerifySection() {
  const classes = useStyles();
  // const { path } = useRouteMatch();
  const [state, dispatch] = useContext(Context);

  const selectedKeywordIds = state.selectedKeywords.map((kwd) => kwd.id);
  const lastKeywordId = selectedKeywordIds[selectedKeywordIds.length - 1];

  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const enableButtons = selectedKeywordIds?.length > 0;

  const curStatus = "pending-domain";
  async function markAndRefresh(label) {
    const res = await markSelected(selectedKeywordIds, curStatus, label);

    if (res.numAffected > 0) setRefresh(!refresh);
  }

  const LabelButtons = () => (
    <div className={classes.markButtonsContainer}>
      <Button
        name="Mark Relevant"
        onClick={() => markAndRefresh("good")}
        unclickedClassName={
          enableButtons ? classes.allCorrectButton : classes.disabledButton
        }
        labelStyleName={classes.buttonText}
        size="small"
      />
      <Button
        name="Mark Irrelevant"
        onClick={() => markAndRefresh("bad")}
        unclickedClassName={
          enableButtons ? classes.allIncorrectButton : classes.disabledButton
        }
        labelStyleName={classes.buttonText}
        size="small"
      />
      <Button
        name="Find Similar"
        onClick={() => dispatch({ type: "ADD_SELECTED_TO_SEARCH" })}
        unclickedClassName={
          enableButtons ? classes.findSimilarButton : classes.disabledButton
        }
        labelStyleName={classes.buttonText}
        size="small"
      />
    </div>
  );

  return (
    <Box className={classes.preselectContainer}>
      <PreselectTable
        refresh={refresh}
        displayStatus={curStatus}
        ButtonsComponent={LabelButtons}
      />
      {lastKeywordId && <KeywordPane keywordId={lastKeywordId} />}
    </Box>
  );
}

export default Verify;
