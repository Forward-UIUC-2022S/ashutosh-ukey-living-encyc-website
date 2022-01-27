import { useContext } from "react";
import { Context } from "../Store";

import { makeStylesStable } from "../utils";

import { Typography } from "@material-ui/core";
import IconButton from "@mui/material/IconButton";

import CancelIcon from "@mui/icons-material/Cancel";

const useStyles = makeStylesStable((theme) => ({
  root: {
    display: "inline-block",
    alignItems: "center",
    border: "2px solid",
    borderColor: theme.palette.pendingYellow.main,
    borderRadius: 16,
    padding: "1px 8px",
    paddingRight: 6,
    marginRight: 5,
    marginBottom: 5,
  },
  container: {
    display: "flex",
  },
  icon: {
    padding: 0,
    "& svg": {
      fontSize: 14,
    },
  },
  text: {
    fontSize: 12,
  },
}));

export default function KeywordChip(props) {
  const classes = useStyles();
  const { keyword } = props;

  const [_, dispatch] = useContext(Context);

  function handleCancel() {
    dispatch({
      type: "REMOVE_SEARCH_KEYWORD",
      keywordId: keyword.id,
    });
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography className={classes.text}>{keyword.name}</Typography>
        <IconButton
          style={{ padding: 0, marginLeft: 4 }}
          className={classes.icon}
          onClick={handleCancel}
        >
          <CancelIcon />
        </IconButton>
      </div>
    </div>
  );
}
