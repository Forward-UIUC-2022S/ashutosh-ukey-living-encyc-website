import { Typography } from "@material-ui/core";
import { makeStylesStable } from "../utils";

import TransparentButton from "./TransparentButton";

const useStyles = makeStylesStable((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "10px 20px",
    height: 50,
    width: "22ch",
    backgroundColor: theme.palette.inputGray.light,
    border: "3px solid",
    borderColor: theme.palette.verifyGreen.main,
    borderRadius: 12,
  },
  text: {
    verticalAlign: "middle",
    textAlign: "center",
    maxWidth: "20ch",
    fontSize: 13,
  },
}));

export default function KeywordDisplayChip(props) {
  const { keyword } = props;
  const classes = useStyles();

  const profileLink = keyword?.id ? "/keyword/" + keyword.id : null;

  return (
    <TransparentButton linkUnderline="none" href={profileLink}>
      <div className={classes.container}>
        <Typography className={classes.text}>{keyword?.name}</Typography>
      </div>
    </TransparentButton>
  );
}
