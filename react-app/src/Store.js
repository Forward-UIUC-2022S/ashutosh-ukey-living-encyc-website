import React, { createContext, useReducer } from "react";
import Reducer from "./Reducer";

const initialState = {
  displayKeywordQuery: null,
  isLoggedIn: false,
  isAdmin: false,
  user: {},

  curVerifyTab: "domain",

  keywordIdInfoPane: null,
  expandedRowId: null,
  keywordTableOpts: [],
  selectedKeywords: {},
  searchKeywords: [],

  expandAdvSearch: false,
  advSearchOpts: {},
  tableLoading: true,
  tableRefreshToggle: false,
  statsRefreshToggle: false,
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
