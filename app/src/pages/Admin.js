import { useState } from "react";

import { Typography } from "@material-ui/core";
import Button from "../components/Button";

import useStyles from "./AdminStyles";

export default function Admin() {
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

    fetch("/labeler/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
  }

  return (
    <div className={classes.container}>
      <div>
        <Typography variant="h4">Upload Keywords</Typography>

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
        {/* <Typography style={{ marginTop: 20 }}>Sample script: </Typography> */}
        {/*fileContent.length > 0 && fileContent*/}
      </div>
    </div>
  );
}
