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
      <PreselectTable displayStatus="pending-info" />
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

function TableVerifySection() {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const [state, dispatch] = useContext(Context);

  const { selectedKeywordIds } = state;

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
    <div>
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
      {/*
    <Button
      unclickedClassName={
        enableButtons ? classes.continueButton : classes.disabledButton
      }
      size="small"
      name="Verify Individually"
      href={enableButtons ? `${path}/individual` : undefined}
    /> 
    */}
    </div>
  );

  return (
    <Box className={classes.preselectContainer}>
      <PreselectTable
        refresh={refresh}
        displayStatus={curStatus}
        ButtonsComponent={LabelButtons}
      />
    </Box>
  );
}

function IndividualRelevanceSection() {
  // let { keywordId } = useParams();
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);

  const { selectedKeywordIds } = state;
  const currKeywordId = selectedKeywordIds[0];

  async function markAndContinue(label) {
    const curStatus = "pending-domain";
    const res = await markSelected([currKeywordId], curStatus, label);

    if (res.numAffected === 1) dispatch({ type: "POP_SELECTED_KEYWORDS" });
  }

  return (
    <Box className={classes.verifyContainer}>
      <SkipBanner />
      <KeywordCard keywordId={currKeywordId} />
      <Box className={classes.classifyContainer}>
        <Button
          name="Irrelevant"
          onClick={() => markAndContinue("bad")}
          unclickedClassName={classes.incorrectButton}
          size="small"
        />
        <Button
          name="Relevant"
          onClick={() => markAndContinue("good")}
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

  async function markAndContinue(label) {
    const curStatus = "pending-info";
    const res = await markSelected([currKeywordId], curStatus, label);

    if (res.numAffected === 1) dispatch({ type: "POP_SELECTED_KEYWORDS" });
  }

  return (
    <Box className={classes.verifyContainer}>
      <SkipBanner />
      <KeywordCard keywordId={currKeywordId} />
      <Box className={classes.classifyContainer}>
        <Button
          name="Incorrect"
          onClick={() => markAndContinue("bad")}
          unclickedClassName={classes.incorrectButton}
          size="small"
        />
        <Button
          name="Correct"
          onClick={() => markAndContinue("good")}
          unclickedClassName={classes.correctButton}
          size="small"
        />
      </Box>
    </Box>
  );
}

export default Verify;
