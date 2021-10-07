function setDifference(arr1, arr2) {
  const setA = new Set(arr1);
  const setB = new Set(arr2);

  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        isAdmin: action.isAdmin,
        user: action.user,
      };
    case "REMOVE_SEARCH_KEYWORD": {
      let newSearchKeywords = state.searchKeywords.filter(
        (keyword) => keyword.id !== action.keywordId
      );
      return {
        ...state,
        searchKeywords: newSearchKeywords,
      };
    }
    case "ADD_SEARCH_KEYWORD": {
      for (let keyword of state.searchKeywords) {
        if (keyword.id === action.keyword.id) return state;
      }
      let newSearchKeywords = [...state.searchKeywords];
      newSearchKeywords.push(action.keyword);

      return {
        ...state,
        searchKeywords: newSearchKeywords,
      };
    }
    case "UPDATE_SELECTED_KEYWORDS":
      let timeSortedIds = action.keywordIds;

      // If selecting a new keyword
      if (action.keywordIds.length > state.selectedKeywordIds.length) {
        // Get newly added item using set difference
        let lastAddedId = setDifference(
          action.keywordIds,
          state.selectedKeywordIds
        );
        lastAddedId = lastAddedId.values().next().value;

        // Create copy and append at the end (maintains add order)
        // Needed because DataGrid library sorts by value, not time
        timeSortedIds = [...state.selectedKeywordIds];
        timeSortedIds.push(lastAddedId);
      }

      return {
        ...state,
        selectedKeywordIds: timeSortedIds,
      };
    default:
      return state;
  }
};

export default Reducer;
