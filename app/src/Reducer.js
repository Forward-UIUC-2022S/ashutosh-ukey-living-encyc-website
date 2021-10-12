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
    case "TOGGLE_ADV_SEARCH":
      return {
        ...state,
        expandAdvSearch: !state.expandAdvSearch,
      };
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
    case "UPDATE_ADV_SEARCH_OPTS":
      return {
        ...state,
        advSearchOpts: action.value,
      };
    case "CLEAR_ADV_SEARCH_OPTS":
      return {
        ...state,
        selectedKeywords: [],
        advSearchOpts: { lengthRange: [0, 100] },
      };
    case "UPDATE_ADV_SEARCH_POS":
      if (state.advSearchOpts.posPattern === action.value) return state;

      return {
        ...state,
        advSearchOpts: {
          ...state.advSearchOpts,
          posPattern: action.value,
        },
      };
    case "UPDATE_LABEL_SEARCH_QUERY":
      if (state.advSearchOpts.nameQuery === action.value) return state;

      return {
        ...state,
        selectedKeywords: [],
        advSearchOpts: {
          ...state.advSearchOpts,
          nameQuery: action.value,
        },
      };
    case "UPDATE_ADV_SEARCH_LRANGE":
      if (
        action.value?.[0] === state.advSearchOpts.lengthRange?.[0] &&
        action.value?.[1] === state.advSearchOpts.lengthRange?.[1]
      )
        return state;

      return {
        ...state,
        advSearchOpts: {
          ...state.advSearchOpts,
          lengthRange: action.value,
        },
      };
    case "ADD_SELECTED_TO_SEARCH":
      let addSearchKeywords = setDifference(
        state.selectedKeywords,
        state.searchKeywords
      );
      if (addSearchKeywords.size === 0)
        return { ...state, expandAdvSearch: true };

      let newSearchKeywords = [...state.searchKeywords];

      for (let kwd of addSearchKeywords.values()) newSearchKeywords.push(kwd);

      return {
        ...state,
        expandAdvSearch: true,
        searchKeywords: newSearchKeywords,
      };
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
      let timeSortedKwds = action.keywords;

      // If selecting a new keyword
      if (action.keywords.length > state.selectedKeywords.length) {
        // Get newly added item using set difference
        let lastAddedKwd = setDifference(
          action.keywords,
          state.selectedKeywords
        );
        lastAddedKwd = lastAddedKwd.values().next().value;

        // Create copy and append at the end (maintains add order)
        // Needed because DataGrid library sorts by value, not time
        timeSortedKwds = [...state.selectedKeywords];
        timeSortedKwds.push(lastAddedKwd);
      }

      return {
        ...state,
        selectedKeywords: timeSortedKwds,
      };
    default:
      return state;
  }
};

export default Reducer;
