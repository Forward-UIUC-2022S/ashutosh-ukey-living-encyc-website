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

import SearchPage from "./pages/Search";
import VerifyPage from "./pages/Verify";
import KeywordPage from "./pages/Keyword";

export default function App() {
  // const [_, dispatch] = useContext(Context);

  return (
    <React.Fragment>
      <Router>
        <NavBar />

        <Switch>
          <PrivateRoute path="/verify" component={VerifyPage} />
          <Route exact path="/">
            <Redirect to="/search" />
          </Route>
          <Route path="/search" component={SearchPage} />
          <Route path="/keyword/:id" component={KeywordPage} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}
