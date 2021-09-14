import { useState, useEffect, useContext } from "react";
import { Context } from "../Store";

import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  useLocation,
} from "react-router-dom";

import AdminSection from "./Admin";

import { Box, Paper, TextField, Typography } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import Button from "../components/Button";
import SkipBanner from "../components/SkipBanner";
import KeywordCard from "../components/KeywordCard";
import PrivateRoute from "../components/PrivateRoute";
import PreselectTable from "../components/PreselectTable";

import useStyles from "./VerifyStyles";

function IndividualRoute(props) {
  const { component: Component, ...rest } = props;
  const [state, _] = useContext(Context);

  const { selectedKeywordIds } = state;
  const allowAccess = selectedKeywordIds.length > 0;

  return (
    <Route
      {...rest}
      render={(props) =>
        allowAccess ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: props.location.pathname.replace("/individual", ""),
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

function Verify() {
  const { path } = useRouteMatch();
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <SideMenu />
      <Switch>
        <PrivateRoute
          path={`${path}/admin`}
          component={AdminSection}
          requireAdmin={true}
        />
        <Route
          exact
          path={`${path}/relevance`}
          component={TableVerifySection}
        />
        <IndividualRoute
          path={`${path}/relevance/individual`}
          component={IndividualRelevanceSection}
        />
        <Route exact path={`${path}/generated`} component={PreselectSection} />
        <IndividualRoute
          path={`${path}/generated/individual`}
          component={IndividualGeneratedSection}
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
    { name: "Relevance", href: `${url}/relevance` },
    { name: "Generated Info", href: `${url}/generated` },
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

function PreselectSection() {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const [state, _] = useContext(Context);

  const [query, setQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const enableButtons = state.selectedKeywordIds?.length > 0;

  return (
    <Box className={classes.preselectContainer}>
      <PreselectTable displayStatus="pending-auto" />
      <div>
        <Button
          unclickedClassName={
            enableButtons ? classes.continueButton : classes.disabledButton
          }
          size="small"
          name="Verify Individually"
          href={enableButtons ? `${path}/individual` : undefined}
        />
      </div>
    </Box>
  );
}

async function markSelected(selectedKeywordIds, status) {
  const labelUrl = "/label?status=" + status;

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

function TableVerifySection() {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const [state, dispatch] = useContext(Context);

  const { selectedKeywordIds } = state;

  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const enableButtons = selectedKeywordIds?.length > 0;

  async function markAndRefresh(status) {
    const res = await markSelected(selectedKeywordIds, status);

    if (res.numAffected > 0) setRefresh(!refresh);
  }

  return (
    <Box className={classes.preselectContainer}>
      <PreselectTable refresh={refresh} displayStatus="pending" />
      <div>
        <Button
          name="Mark Relevant"
          onClick={() => markAndRefresh("pending-auto")}
          unclickedClassName={
            enableButtons ? classes.allCorrectButton : classes.disabledButton
          }
          size="small"
        />
        <Button
          name="Mark Irrelevant"
          onClick={() => markAndRefresh("irrelevant")}
          unclickedClassName={
            enableButtons ? classes.allIncorrectButton : classes.disabledButton
          }
          size="small"
        />
        <Button
          unclickedClassName={
            enableButtons ? classes.continueButton : classes.disabledButton
          }
          size="small"
          name="Verify Individually"
          href={enableButtons ? `${path}/individual` : undefined}
        />
      </div>
    </Box>
  );
}

function IndividualRelevanceSection() {
  // let { keywordId } = useParams();
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);

  const { selectedKeywordIds } = state;
  const currKeywordId = selectedKeywordIds[0];

  async function markAndContinue(status) {
    const res = await markSelected([currKeywordId], status);

    if (res.numAffected === 1) dispatch({ type: "POP_SELECTED_KEYWORDS" });
  }

  return (
    <Box className={classes.verifyContainer}>
      <SkipBanner />
      <KeywordCard keywordId={currKeywordId} />
      <Box className={classes.classifyContainer}>
        <Button
          name="Irrelevant"
          onClick={() => markAndContinue("irrelevant")}
          unclickedClassName={classes.incorrectButton}
          size="small"
        />
        <Button
          name="Relevant"
          onClick={() => markAndContinue("pending-auto")}
          unclickedClassName={classes.correctButton}
          size="small"
        />
      </Box>
    </Box>
  );
}

function IndividualGeneratedSection() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);

  const { selectedKeywordIds } = state;
  const currKeywordId = selectedKeywordIds[0];

  async function markAndContinue(status) {
    const res = await markSelected([currKeywordId], status);

    if (res.numAffected === 1) dispatch({ type: "POP_SELECTED_KEYWORDS" });
  }

  return (
    <Box className={classes.verifyContainer}>
      <SkipBanner />
      <KeywordCard keywordId={currKeywordId} />
      <Box className={classes.classifyContainer}>
        <Button
          name="Incorrect"
          onClick={() => markAndContinue("incorrect-auto")}
          unclickedClassName={classes.incorrectButton}
          size="small"
        />
        <Button
          name="Correct"
          onClick={() => markAndContinue("verified")}
          unclickedClassName={classes.correctButton}
          size="small"
        />
      </Box>
    </Box>
  );
}

export default Verify;
