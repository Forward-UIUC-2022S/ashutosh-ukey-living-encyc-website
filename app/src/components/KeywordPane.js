import { useEffect, useState } from "react";

import TransparentButton from "./TransparentButton";

import { Box, Typography, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  googleIcon: {
    marginLeft: 12,
    height: 20,
    width: 20,
  },
  container: {
    backgroundColor: theme.palette.backGray.main,
    maxWidth: 280,
    border: "9px solid",
    borderColor: theme.palette.pendingYellow.main,
    flex: 1,
    flexDirection: "column",
    padding: "25px 15px",
    marginLeft: 10,
  },
  titleContainer: {
    display: "flex",
  },
  titleText: {
    fontSize: 16,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginTop: 10,
  },
  infoText: { fontSize: 14, marginTop: 10 },
}));

export default function KeywordPane(props) {
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

  const googleSearchQuery = encodeURIComponent(keyword?.name);
  const googleSearchUrl = "http://www.google.com/search?q=" + googleSearchQuery;

  return (
    <Box className={classes.container}>
      {keyword?.name && (
        <div className={classes.titleContainer}>
          <Typography className={classes.titleText}>
            {
              // <u>{keyword.name}</u>
            }
            {keyword.name}
          </Typography>
          <TransparentButton href={googleSearchUrl} target="_blank">
            <img
              className={classes.googleIcon}
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
          </TransparentButton>
        </div>
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
