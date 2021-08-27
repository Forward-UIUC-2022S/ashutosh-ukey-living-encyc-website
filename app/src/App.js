import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
          <PrivateRoute path="/verify" component={VerifyPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}
