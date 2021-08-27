import { makeStyles } from "@material-ui/core/styles";

const sideButtonStyle = {
  width: 250,
  padding: "8px 0px",
};

const verifyButtonStyles = {
  width: "25%",
  padding: 8,
  maxWidth: 220,
  border: "2px solid",
  borderRadius: 10,
};
const useStyles = makeStyles((theme) => ({
  fileInput: {
    marginTop: 40,
    marginBottom: 15,
  },
  uploadButton: {
    ...verifyButtonStyles,
    maxWidth: 180,
    height: 35,
    backgroundColor: theme.palette.pendingYellow.main,
    "&:hover": {
      background: theme.palette.pendingYellow.main,
    },
  },
  continueButton: {
    ...verifyButtonStyles,
    maxWidth: 280,
    backgroundColor: theme.palette.pendingYellow.main,
    "&:hover": {
      background: theme.palette.pendingYellow.main,
    },
  },
  correctButton: {
    ...verifyButtonStyles,
    backgroundColor: theme.palette.verifyGreen.main,
    "&:hover": {
      background: theme.palette.verifyGreen.main,
    },
  },
  incorrectButton: {
    ...verifyButtonStyles,
    backgroundColor: theme.palette.verifyRed.main,
    "&:hover": {
      background: theme.palette.verifyRed.main,
    },
  },
  classifyContainer: {
    marginTop: 80,
    display: "flex",
    justifyContent: "space-between",
    width: "60%",
  },
  verifyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  keywordDomainCard: {
    backgroundColor: theme.palette.backGray.main,
    width: "40%",
    height: "30%",
    maxWidth: 500,
    marginTop: 80,
    border: "6px solid",
    borderColor: theme.palette.pendingYellow.main,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sideButtonClicked: {
    ...sideButtonStyle,
    background: theme.palette.backGray.dark,
    "&:hover": {
      background: theme.palette.backGray.dark,
    },
  },
  sideButtonUnclicked: {
    ...sideButtonStyle,
  },
  uploadContainer: {
    display: "flex",
    width: "100%",
    // height: 240,
    flexDirection: "column",
    // justifyContent: "space-between",
    padding: 40,
  },
  preselectContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 50,
  },
  sideContainer: {
    background: theme.palette.backGray.main,
    display: "flex",
    flexDirection: "column",
    paddingTop: 30,
    maxWidth: 300,
    height: 800,
  },
  container: {
    display: "flex",
    flexDirection: "row",
  },
}));

export default useStyles;
