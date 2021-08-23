import { useContext } from "react";
import { Context } from "../Store";
import { makeStyles } from "@material-ui/core/styles";

import { Box } from "@material-ui/core";

import Button from "./Button";
// import TransparentLink from "./TransparentLink";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.main,
  },
  clickedButton: {
    background: theme.palette.primary.highlight,
    "&:hover": {
      background: theme.palette.primary.highlight,
    },
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);

  const navbarOpts = [
    { name: "Search", href: "/search" },
    { name: "Verify", href: "/verify" },
    { name: "Home", href: "/" },
  ];

  return (
    <Box className={classes.root}>
      {navbarOpts.map((opt) => (
        <Button
          clickedClassName={classes.clickedButton}
          name={opt.name}
          href={opt.href}
        />
      ))}
    </Box>
  );
}
