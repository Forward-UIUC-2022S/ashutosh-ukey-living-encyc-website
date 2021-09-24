import { useLocation } from "react-router-dom";

import { Button as MuiButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  label: {
    textTransform: "capitalize",
    padding: "4px 26px",
    fontSize: 16,
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
  const { href, labelStyleName } = props;
  const classes = useStyles();
  const location = useLocation();

  function isClicked(location, href) {
    if (href === undefined) return false;

    const currPath = location.pathname;
    if (href.length == 1) return currPath === href;

    return currPath.includes(href);
  }

  const InnerButton = () => (
    <MuiButton
      classes={{
        label: `${classes.label} ${labelStyleName ?? ""}`,
      }}
      onClick={props.onClick}
      className={
        isClicked(location, href)
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
