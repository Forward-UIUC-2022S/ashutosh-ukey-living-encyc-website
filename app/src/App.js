import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Store from "./Store";

import NavBar from "./components/NavBar";

import HomePage from "./pages/Home";
import VerifyPage from "./pages/Verify";

export default function App() {
  return (
    <Store>
      <Router>
        <NavBar />

        <Switch>
          <Route path="/verify">
            <VerifyPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </Store>
  );
}
