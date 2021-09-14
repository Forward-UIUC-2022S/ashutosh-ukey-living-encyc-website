const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        isAdmin: action.isAdmin,
        user: action.user,
      };
    case "UPDATE_SELECTED_KEYWORDS":
      return {
        ...state,
        selectedKeywordIds: action.keywordIds,
      };
    case "POP_SELECTED_KEYWORDS":
      let currSelectedIds = state.selectedKeywordIds;

      return {
        ...state,
        selectedKeywordIds:
          currSelectedIds.length === 1 ? [] : currSelectedIds.slice(1),
      };
    default:
      return state;
  }
};

export default Reducer;
