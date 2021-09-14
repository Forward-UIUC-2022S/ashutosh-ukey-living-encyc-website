import { makeStyles } from "@material-ui/core/styles";

function staticButtonColorStyle(color) {
  return {
    backgroundColor: color,
    "&:hover": {
      background: color,
    },
  };
}

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
const verifyAllButtonStyles = {
  ...verifyButtonStyles,
  marginRight: 20,
  maxWidth: 220,
};

const useStyles = makeStyles((theme) => ({
  fileInput: {
    marginTop: 40,
    marginBottom: 15,
  },
  disabledButton: {
    ...verifyAllButtonStyles,
    ...staticButtonColorStyle(theme.palette.backGray.main),
    pointerEvents: "none",
  },
  uploadButton: {
    ...verifyButtonStyles,
    ...staticButtonColorStyle(theme.palette.pendingYellow.main),
    maxWidth: 180,
    height: 35,
  },
  continueButton: {
    ...verifyAllButtonStyles,
    ...staticButtonColorStyle(theme.palette.pendingYellow.main),
  },
  allCorrectButton: {
    ...verifyAllButtonStyles,
    ...staticButtonColorStyle(theme.palette.verifyGreen.main),
  },
  allIncorrectButton: {
    ...verifyAllButtonStyles,
    ...staticButtonColorStyle(theme.palette.verifyRed.main),
  },
  correctButton: {
    ...verifyButtonStyles,
    ...staticButtonColorStyle(theme.palette.verifyGreen.main),
  },
  incorrectButton: {
    ...verifyButtonStyles,
    ...staticButtonColorStyle(theme.palette.verifyRed.main),
  },
  classifyContainer: {
    marginTop: 60,
    display: "flex",
    justifyContent: "space-between",
    width: "60%",
  },
  verifyContainer: {
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  sideButtonClicked: {
    ...sideButtonStyle,
    ...staticButtonColorStyle(theme.palette.backGray.dark),
  },
  sideButtonUnclicked: {
    ...sideButtonStyle,
  },
  adminContainer: {
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
