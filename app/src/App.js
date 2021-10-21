import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Context } from "./Store";

import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";

import HomePage from "./pages/Home";
import VerifyPage from "./pages/Verify";

export default function App() {
  const [_, dispatch] = useContext(Context);

  return (
    <React.Fragment>
      <Router>
        <NavBar />

        <Switch>
          <Route exact path="/">
            <Redirect to="/search" />
          </Route>
          <PrivateRoute path="/verify" component={VerifyPage} />
          <Route path="/search" component={HomePage} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}
