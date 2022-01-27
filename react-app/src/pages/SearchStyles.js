import { makeStylesStable } from "../utils";

const useStyles = makeStylesStable((theme) => ({
  keywordChipsContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    overflowY: "scroll",
    marginTop: 30,
    border: "2px solid",
    height: 400,
    width: "110ch",
    padding: "20px 30px",
    // paddingTop: 15,
  },
  subContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 400,
    marginTop: 50,
  },
  container: {
    paddingTop: 70,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
    // height: 800,
  },
  searchTitle: {
    fontSize: 30,
  },
  searchInput: {
    width: "110ch",
    margin: "0px 26px",
    backgroundColor: theme.palette.inputGray.main,
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: 5,
    marginBottom: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
}));

export default useStyles;
