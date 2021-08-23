import { useContext } from "react";
import { Context } from "../Store";

import { Box } from "@material-ui/core";
import AccountIcon from "@material-ui/icons/Person";

import Button from "./Button";
import TransparentButton from "./TransparentButton";
import { makeStyles } from "@material-ui/core/styles";
// import TransparentLink from "./TransparentLink";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    background: theme.palette.primary.main,
  },
  clickedButton: {
    background: theme.palette.primary.highlight,
    "&:hover": {
      background: theme.palette.primary.highlight,
    },
  },
  iconContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 25,
    marginTop: 5,
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
    <div className={classes.root}>
      {navbarOpts.map((opt) => (
        <Button
          clickedClassName={classes.clickedButton}
          name={opt.name}
          href={opt.href}
        />
      ))}
      <div className={classes.iconContainer}>
        <TransparentButton onClick={() => console.log("Display login info")}>
          <AccountIcon className={classes.icon} />
        </TransparentButton>
      </div>
    </div>
  );
}
