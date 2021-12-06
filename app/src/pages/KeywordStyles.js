import { makeStylesStable } from "../utils";

export const backIconSize = 40;
export const definitionIconSize = 29;

const useStyles = makeStylesStable((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    // height: 1600,
    padding: "12px 8px",
  },
  surveysAndSimilarSection: { display: "flex", marginTop: 40 },
  similarityContainer: {
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
    // flexGrow: 1,
    marginLeft: 50,
    // width: "100%",
    marginBottom: 50,
  },
  keywordChipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    overflowY: "scroll",
    marginTop: 12,
    paddingRight: 40,
    paddingLeft: 30,
  },
  chipWrapper: { margin: 10 },
  surveysContainer: {
    backgroundColor: theme.palette.inputGray.main,
    border: "1px solid",
    width: 350,
    minHeight: 300,
    padding: "25px 25px",
    paddingBottom: 40,
  },
  surveysList: { marginTop: 15 },
  surveryItem: { display: "flex", marginTop: 10 },
  surveyTitleA: { textDecoration: "none", color: "black" },
  definitionsContainer: {
    backgroundColor: theme.palette.inputGray.main,
    minHeight: 150,
    marginTop: 25,
    border: "1px solid",
    paddingTop: 5,
    paddingBottom: 25,
  },
  definitionsList: {
    marginLeft: 40,
    marginTop: 10,
  },
  definitionItem: { display: "flex", alignItems: "center", marginTop: 10 },
  infoContainer: {
    marginLeft: 40,
    marginTop: 5,
    paddingRight: 30,
    display: "flex",
    flexDirection: "column",
  },
  titleContainer: {
    display: "flex",
  },
  wikiIcon: { marginLeft: 15, height: 40, padding: 0 },
}));

export default useStyles;
