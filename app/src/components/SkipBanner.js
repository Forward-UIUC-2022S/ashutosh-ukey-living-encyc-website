import { useState, useEffect, useContext } from "react";
import { Context } from "../Store";

import { Typography } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import TransparentButton from "./TransparentButton";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "60%",
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 25,
    paddingRight: 30,
  },
  icon: { width: 15, height: 15, marginLeft: 3 },
  button: { display: "flex", alignItems: "center" },
}));

export default function Button(props) {
  const { href } = props;
  const classes = useStyles();
  const [_, dispatch] = useContext(Context);

  function onClick() {
    dispatch({ type: "POP_SELECTED_KEYWORDS" });
  }

  return (
    <div className={classes.container}>
      <TransparentButton className={classes.button} onClick={onClick}>
        <Typography>
          <u>Skip</u>
        </Typography>
        <ArrowForwardIosIcon className={classes.icon} />
      </TransparentButton>
    </div>
  );
}
