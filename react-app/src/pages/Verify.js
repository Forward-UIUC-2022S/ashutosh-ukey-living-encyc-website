import { useState, useEffect, useContext } from "react";
import { Context } from "../Store";

import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";

import AdminSection from "./Admin";
import SettingsSection from "./Settings";

import { Box, Paper, TextField, Typography } from "@material-ui/core";

import Button from "../components/Button";
import KeywordPane from "../components/KeywordPane";
import PrivateRoute from "../components/PrivateRoute";
import SearchSelectPane from "../components/SearchSelectPane";

import useStyles from "./VerifyStyles";
import { fetchApi } from "../utils";

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
        <Route exact path={`${path}/`}>
          <Redirect to={`${path}/relevance`} />
        </Route>
        <Route path={`${path}/relevance`} component={DomainVerifySection} />
        <Route path={`${path}/definition`} component={DomainVerifySection} />
        <Route path={`${path}/tutorial`} component={DomainVerifySection} />
        <Route path={`${path}/settings`} component={SettingsSection} />
      </Switch>
    </Box>
  );
}

function SideMenu() {
  const [state, dispatch] = useContext(Context);
  const { isAdmin } = state;

  const { url } = useRouteMatch();
  const classes = useStyles();

  const curDeployedTabIdxs = [0, 1, 4];
  let sideMenuOpts = [
    { name: "Admin", href: `${url}/admin`, requireAdmin: true },
    { name: "Domain Relevance", href: `${url}/relevance`, tabIden: "domain" },
    {
      name: "Definitions",
      href: `${url}/definition`,
      tabIden: "definition",
    },
    {
      name: "Tutorials & Surveys",
      href: `${url}/tutorial`,
      tabIden: "tutorial",
    },
    { name: "Settings", href: `${url}/settings` },
  ];
  // sideMenuOpts = curDeployedTabIdxs.map((i) => sideMenuOpts[i]);

  return (
    <Box className={classes.sideContainer}>
      {sideMenuOpts.map(
        (opt, idx) =>
          (!opt.requireAdmin || isAdmin) && (
            <Button
              key={idx}
              onClick={
                opt.tabIden &&
                (() => dispatch({ type: "SET_VERIFY_TAB", value: opt.tabIden }))
              }
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

async function markSelected(selectedKeywordIds, label) {
  const labelUrl = `/labeler/keywords/mark?label=${label}`;

  let res = await fetchApi(labelUrl, {
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
  const [state, dispatch] = useContext(Context);

  const { curVerifyTab } = state;
  const selectedKeywordIds = Object.keys(state.selectedKeywords);
  // const lastKeywordId = selectedKeywordIds[selectedKeywordIds.length - 1];
  // console.log("Last added keyword id: ", lastKeywordId);

  // const [refresh, setRefresh] = useState(false);

  const enableButtons = selectedKeywordIds?.length > 0;

  async function markAndRefresh(label) {
    const res = await markSelected(selectedKeywordIds, label);

    if (res.numAffected > 0) {
      dispatch({ type: "REFRESH_TABLE" });
      dispatch({ type: "REFRESH_USER_STATS" });
    }
  }

  const labelKeywords = curVerifyTab === "domain";
  const LabelButtons = () => (
    <div className={classes.markButtonsContainer}>
      {labelKeywords && (
        <>
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
              enableButtons
                ? classes.allIncorrectButton
                : classes.disabledButton
            }
            labelStyleName={classes.buttonText}
            size="small"
          />
        </>
      )}
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
      <SearchSelectPane ButtonsComponent={LabelButtons} />
      <KeywordPane />
    </Box>
  );
}

export default Verify;
