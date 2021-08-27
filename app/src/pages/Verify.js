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
      {sideMenuOpts.map((opt, idx) => (
        <Button
          key={idx}
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
        <Route path={`${path}/upload`} component={UploadSection} />
        <Route exact path={`${path}/relevance`} component={PreselectSection} />
        <Route
          path={`${path}/relevance/:keywordId`}
          component={VerifyKeywordDomain}
        />
      </Switch>
    </Box>
  );
}

function UploadSection() {
  const classes = useStyles();
  const [file, setFile] = useState();
  const [fileContent, setFileContent] = useState("");

  function onFileChange(event) {
    const newFile = event.target.files[0];
    setFile(newFile);

    const reader = new FileReader();

    // Read in file's content
    reader.onload = function (e) {
      setFileContent(reader.result);
    };
    reader.readAsText(newFile);
  }

  // On file upload (click the upload button)
  function onFileUpload() {
    if (!file) return;

    const reqBody = {
      name: file.name,
      data: fileContent,
    };

    fetch("/label/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
  }

  return (
    <div className={classes.uploadContainer}>
      <Typography variant="h4">CSV Keywords File</Typography>

      <div>
        <input
          className={classes.fileInput}
          type="file"
          onChange={onFileChange}
        />
        <Button
          unclickedClassName={classes.uploadButton}
          size="small"
          name="Upload"
          onClick={onFileUpload}
        />
      </div>

      {fileContent.length > 0 && fileContent}
    </div>
  );
}

function PreselectSection() {
  const classes = useStyles();
  const { path } = useRouteMatch();

  const [query, setQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  return (
    <Box className={classes.preselectContainer}>
      <Table />
      <Button
        unclickedClassName={classes.continueButton}
        size="small"
        name="Continue to verify"
        href={`${path}/relevance/5`}
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
