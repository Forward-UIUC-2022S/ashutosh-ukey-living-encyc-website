import { proxy } from "../../package.json";
import { useContext, useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Context } from "../Store";

import { Box, Typography } from "@material-ui/core";
import AccountIcon from "@material-ui/icons/Person";
import LogoutIcon from "@material-ui/icons/ExitToApp";

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
    alignItems: "center",
    width: "100%",
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
    marginTop: 5,
  },
  nameDisplay: {
    marginRight: 20,
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);

  const { user, isLoggedIn } = state;

  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    async function checkLoggedIn() {
      try {
        let res = await fetch("/auth/verify", {
          method: "GET",
          credentials: "include",
        });
        res = await res.json();
        console.log("Google user info: ", res);

        dispatch({
          type: "LOGIN",
          isAdmin: res.is_admin,
          user: {
            email: res.email,
            firstName: res.first_name,
            lastName: res.last_name,
          },
        });

        history.replace(location.pathname);
      } catch (error) {
        console.log(error);
      }
    }

    checkLoggedIn();
  }, []);

  function handleLogin() {
    console.log(`${proxy}/auth/login`);
    window.open(`${proxy}/auth/login`, "_self");
  }

  function handleLogout() {
    window.open(`${proxy}/auth/logout`, "_self");
  }

  return (
    <div className={classes.root}>
      <Button
        clickedClassName={classes.clickedButton}
        name="Search"
        href="/search"
      />
      {isLoggedIn && (
        <Button
          clickedClassName={classes.clickedButton}
          name="Verify"
          href="/verify"
        />
      )}
      <div className={classes.iconContainer}>
        <Typography className={classes.nameDisplay}>{user.email}</Typography>
        <TransparentButton onClick={handleLogin}>
          <AccountIcon className={classes.icon} />
        </TransparentButton>
        {isLoggedIn && (
          <TransparentButton onClick={handleLogout}>
            <LogoutIcon className={classes.icon} />
          </TransparentButton>
        )}
      </div>
    </div>
  );
}
