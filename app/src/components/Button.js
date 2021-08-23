import { useContext } from "react";
import { Context } from "../Store";
import { useLocation } from "react-router-dom";

import { Button as MuiButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  label: {
    textTransform: "capitalize",
    padding: "4px 26px",
    fontSize: 18,
  },
  unclickedContainer: {
    background: theme.palette.primary.main,
  },
  clickedContainer: {
    background: theme.palette.primary.highlight,
    "&:hover": {
      background: theme.palette.primary.highlight,
    },
  },
}));

export default function Button(props) {
  const { navId, href } = props;
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const location = useLocation();

  function isClicked(location, href, state, navId) {
    if (href == undefined) {
      return false;
    }

    const searchUrlPref = "/search";
    // const entityUrlPref = "/entity";
    const currPath = location.pathname;

    if (href == currPath) {
      if (href == searchUrlPref) {
        return navId == state.entityTypeIdx;
      }
      return true;
    } else if (
      href == searchUrlPref &&
      currPath.substring(0, searchUrlPref.length) == searchUrlPref
    ) {
      return navId == state.entityTypeIdx;
    }
    return false;
  }

  const InnerButton = () => (
    <MuiButton
      classes={{
        /*root: isClicked(location, href, state, navId)
          ? classes.clickedContainer
          : classes.unclickedContainer,*/
        label: classes.label,
      }}
      onClick={props.onClick}
      className={
        isClicked(location, href, state, navId)
          ? props.clickedClassName
          : props.unclickedClassName
      }
      size={props.size}
    >
      {props.name}
    </MuiButton>
  );

  return props.href ? (
    <Link to={props.href} style={{ textDecoration: "none" }}>
      <InnerButton />
    </Link>
  ) : (
    <InnerButton />
  );
}
