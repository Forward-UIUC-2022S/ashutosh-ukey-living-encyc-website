import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { Context } from "../Store";

export default function PrivateRoute(props) {
  const { component: Component, requireAdmin, ...rest } = props;
  const [state, _] = useContext(Context);

  const { isLoggedIn, isAdmin } = state;
  const allowAccess = isLoggedIn && (!requireAdmin || isAdmin);

  return (
    <Route
      {...rest}
      render={(props) =>
        allowAccess ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
