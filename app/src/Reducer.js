const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        user: action.user,
      };
    default:
      return state;
  }
};

export default Reducer;
