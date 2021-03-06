import { makeStylesStable } from "../utils";
import { staticButtonColorStyle } from "../utils";

const sideButtonStyle = {
  width: 220,
  padding: "8px 0px",
};

const verifyButtonStyles = {
  padding: 0,
  maxWidth: 200,
  border: "2px solid",
  borderRadius: 10,
};
const verifyAllButtonStyles = {
  ...verifyButtonStyles,
  marginRight: 10,
};

const useStyles = makeStylesStable((theme) => ({
  markButtonsContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: -3,
  },
  buttonText: {
    fontSize: 14,
    padding: "2px 18px",
  },
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
  findSimilarButton: {
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
    flexDirection: "row",
    // width: "100%",
    flex: 2,
    // paddingTop: 30,
    paddingLeft: 20,
  },
  sideContainer: {
    background: theme.palette.backGray.main,
    display: "flex",
    flexDirection: "column",
    paddingTop: 30,
    height: 800,
  },
  container: {
    display: "flex",
    flexDirection: "row",
  },
}));

export default useStyles;
