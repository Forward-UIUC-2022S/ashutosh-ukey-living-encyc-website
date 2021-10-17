import { makeStyles } from "@material-ui/core/styles";

const verifyButtonStyles = {
  width: "25%",
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
  container: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    padding: 40,
  },
}));

export default useStyles;
