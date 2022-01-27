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
  articleContainer: {
    padding: "30px 40px",
    display: "flex",
    flexDirection: "column",
    border: "3px solid",
    borderColor: "grey",
    backgroundColor: theme.palette.inputGray.main,
    height: 1500,
    marginTop: 50,
    width: "75%",
    alignSelf: "center",
    overflowY: "scroll",
  },
  topEntitiesContainer: {
    display: "flex",
    flexDirection: "column",
    width: 570,
    border: "4px solid",
    borderRadius: 40,
    borderColor: "grey",
    padding: 40,
    paddingTop: 30,
  },
  researcherItem: { display: "flex", marginTop: 10, alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  avatarIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  topPapersList: { marginTop: 15, overflowY: "scroll", maxHeight: 500 },
  paperItem: { display: "flex", marginTop: 10 },
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
    width: 600,
    minHeight: 300,
    padding: "20px 30px",
    // paddingRight: 40,
    paddingBottom: 5,
  },
  surveysList: {
    marginTop: 15,
    overflowY: "scroll",
    maxHeight: 600,
  },
  surveryItem: { display: "flex", marginTop: 10 },
  surveyTitleA: { textDecoration: "none", color: "black" },
  definitionsContainer: {
    backgroundColor: theme.palette.inputGray.main,
    // minHeight: 100,
    marginTop: 25,
    border: "1px solid",
    padding: 16,
  },
  definitionsList: {
    // marginLeft: 15,
    // marginTop: 10,
  },
  definitionItem: {
    display: "flex",
    alignItems: "center", // marginTop: 10
  },
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
