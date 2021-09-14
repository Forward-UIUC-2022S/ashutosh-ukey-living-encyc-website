import { useEffect, useState } from "react";

import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.backGray.main,
    width: "40%",
    height: "30%",
    maxWidth: 500,
    border: "6px solid",
    borderColor: theme.palette.pendingYellow.main,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    padding: 20,
    justifyContent: "space-around",
  },
  titleText: {
    fontSize: 18,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 20,
    height: "100%",
    marginTop: 10,
  },
  infoText: { fontSize: 14, marginTop: 10 },
}));

export default function KeywordCard(props) {
  const classes = useStyles();
  const { keywordId } = props;

  const [keyword, setKeyword] = useState();

  useEffect(() => {
    async function getKeywordInfo() {
      if (keywordId) {
        const keywordInfoUrl = "/keyword?id=" + keywordId;
        let res = await fetch(keywordInfoUrl, {
          method: "GET",
        });
        res = await res.json();
        setKeyword(res);
        console.log("Keyword info: ", res);
      }
    }

    getKeywordInfo();
  }, [keywordId]);

  return (
    <Box className={classes.container}>
      {keyword?.name && (
        <Typography className={classes.titleText}>
          <u>{keyword.name}</u>
        </Typography>
      )}
      <div className={classes.infoContainer}>
        {keyword?.id && (
          <Typography className={classes.infoText}>
            <b>Id:</b> {keyword.id}
          </Typography>
        )}
        {keyword?.definition && (
          <Typography className={classes.infoText}>
            <b>Definition:</b> {keyword.definition}
          </Typography>
        )}
      </div>
    </Box>
  );
}
