import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getHoverInteract } from "../utils";

import { Typography } from "@material-ui/core";
import Button from "../components/Button";

import Checkbox from "@mui/material/Checkbox";

import useStyles from "./SettingsStyles";

export default function Settings() {
  const [cookies, setCookie] = useCookies(["settings"]);

  const [hoverChecked, setHoverChecked] = useState(getHoverInteract(cookies));

  const classes = useStyles();
  const [file, setFile] = useState();

  useEffect(() => {
    if (cookies.settings === undefined) {
      setCookie(
        "settings",
        {
          hoverInteract: false,
        },
        {
          path: "/",
        }
      );
    } else {
      console.log(cookies.settings);
    }
  }, []);

  function handleHoverCheck(checked) {
    setHoverChecked(checked);

    let currSettings = {};
    if (cookies.settings !== undefined) currSettings = { ...cookies.settings };

    setCookie(
      "settings",
      {
        ...currSettings,
        hoverInteract: checked,
      },
      {
        path: "/",
      }
    );
  }

  return (
    <div className={classes.container}>
      <div>
        <Typography variant="h4">Settings</Typography>

        <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          <Checkbox
            checked={hoverChecked}
            onChange={(event) => handleHoverCheck(event.target.checked)}
          />
          <Typography style={{ fontSize: 20 }}>Respond to hover </Typography>
        </div>
        {/* <Typography style={{ marginTop: 20 }}>Sample script: </Typography> */}
      </div>
    </div>
  );
}
