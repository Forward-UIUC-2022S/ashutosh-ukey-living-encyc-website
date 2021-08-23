function toggleArrayElem(state, stateAttr, newElem) {
  let newSelectedElems = state[stateAttr];
  const currElemIds = state[stateAttr].map((elem) => elem.id);

  if (currElemIds.includes(newElem.id)) {
    newSelectedElems = state[stateAttr].filter((elem) => elem.id != newElem.id);
  } else {
    newSelectedElems = state[stateAttr].concat(newElem);
  }

  state[stateAttr] = newSelectedElems;
  return { ...state };
}

const Reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_KEYWORD":
      return toggleArrayElem(state, "selectedKeywords", action.keyword);
    case "SET_KEYWORDS":
      return {
        ...state,
        selectedKeywords: action.keywords,
      };
    case "TOGGLE_FIELD":
      return toggleArrayElem(state, "selectedFields", action.field);
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.value,
      };
    case "STORE_RANKS":
      return {
        ...state,
        rankResults: action.rankData,
      };
    case "STORE_COMPARE":
      return {
        ...state,
        compareResults: action.rankData,
      };
    case "UPDATE_SEARCH_TAB":
      return {
        ...state,
        rankResults: [],
        compareResults: [],
        entityTypeIdx: action.entityTypeIdx,
      };
    case "UPDATE_SELECTED_FIELDS":
      return {
        ...state,
        selectedFields: action.fieldsData,
      };
    case "ADD_COMPARE_ENTITY":
      return {
        ...state,
        compareResults: state.compareResults.concat(action.institution),
      };
    case "REMOVE_COMPARE_ENTITY":
      return {
        ...state,
        compareResults: state.compareResults.filter(
          (inst) => inst.id != action.id
        ),
      };
    default:
      return state;
  }
};

export default Reducer;
