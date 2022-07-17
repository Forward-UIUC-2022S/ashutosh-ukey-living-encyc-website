import { makeStylesStable } from "../utils";

export const sectionIconSize = 25;
export const flagIconSize = 24;
export const backIconSize = 40;
export const definitionIconSize = 29;

export const sectionHeaderStyle = {
  marginBottom: 10,
  paddingBottom: 5,
  borderBottom: "2px solid grey",
  fontSize: 24,
  fontFamily: "Times New Roman",
};

export const mainTitleStyle = {
  marginBottom: 10,
  paddingBottom: 5,
  marginTop: 25,
  display: "flex",
  borderBottom: "1px solid black",
  fontFamily: "Times New Roman",
  fontSize: 32,
};

const useStyles = makeStylesStable((theme) => ({
  flagListItem: { display: "flex", alignItems: "center" },
  timelineContainer: {
    display: "flex",
    width: "40%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    // height: 70,
    // width: "50%",
    marginLeft: 70,
    marginBottom: -30,
  },
  usageList: {
    overflowY: "scroll",
    maxHeight: 250,
  },
  usageSection: {
    marginTop: 30,
    marginLeft: 20,
    marginBottom: -10,
    display: "flex",
    flexDirection: "column",
  },
  overviewSection: {
    marginTop: 20,
    marginLeft: 40,
    display: "flex",
    alignItems: "start",
    justifyContent: "start",
    maxWidth: "100%",
  },
  loadingCircleContainer: {
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    flex: 1,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    // height: 1600,
    padding: "12px 8px",
  },
  articleContainer: {
    // padding: "30px 40px",
    display: "flex",
    flexDirection: "column",

    marginLeft: 20,
    marginTop: 0,

    // border: "3px solid",
    // borderColor: "grey",
    // backgroundColor: theme.palette.inputGray.main,
    // height: 1500,
    // marginTop: 50,
    // width: "75%",
    // alignSelf: "center",
    // overflowY: "scroll",
  },
  topEntitiesSection: {
    marginLeft: 20,
    // marginTop: 20,
    display: "flex",
    flexDirection: "column",
    // height: 500,
    // justifyContent: "space-evenly",
  },
  topEntitiesContainer: {
    display: "flex",
    flexDirection: "column",
    // width: 570,
    // border: "4px solid",
    // borderRadius: 40,
    // borderColor: "grey",
    // padding: 40,
    paddingTop: 20,
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
  topEntitiesList: {
    marginTop: 15,
    overflowY: "scroll",
    maxHeight: 250,
    marginLeft: 30,
  },
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
    marginTop: 15,
  },
  chipWrapper: { margin: 10, display: "flex" },
  referencesContainer: {
    // backgroundColor: theme.palette.inputGray.main,
    // border: "1px solid",
    // width: 600,
    // minHeight: 300,
    // padding: "20px 30px",
    // paddingRight: 40,
    // paddingBottom: 5,
    marginTop: 30,
    // marginLeft: 20,
  },
  surveysList: {
    // marginTop: 15,
    marginLeft: 30,
    overflowY: "scroll",
    maxHeight: 250,
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
    paddingBottom: 200,
    display: "flex",
    flexDirection: "column",
  },
  wikiIcon: { marginLeft: 15, height: 40, padding: 0 },
}));

export default useStyles;
