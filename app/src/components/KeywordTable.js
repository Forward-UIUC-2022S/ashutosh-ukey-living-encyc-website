import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Context } from "../Store";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  tableHead: {
    zIndex: 2,
    height: 45,
    top: 0,
    position: "sticky",
    backgroundColor: theme.palette.pendingYellow.main,
  },
  groupRow: {
    backgroundColor: theme.palette.inputGray.main,
  },
  innerRow: {
    // backgroundColor: theme.palette.inputGray.main,
  },
  tableCellButton: {
    "&:hover": {
      cursor: "pointer",
    },
    cursor: "pointer",
    textDecoration: "none",
  },
}));

function Row(props) {
  const classes = useStyles();
  const { row: group } = props;

  const [state, dispatch] = useContext(Context);
  const { selectedKeywords, expandedRowId } = state;

  const [open, setOpen] = useState(false);
  const [rowChecked, setRowChecked] = useState(false);

  useEffect(() => {
    if (expandedRowId !== group.id) setOpen(false);
  }, [expandedRowId]);

  useEffect(() => {
    const checkSelectedReducer = (previousValue, currentValue) =>
      previousValue || currentValue in selectedKeywords;
    let keywordSelected = group.keywords
      .map((e) => e.id)
      .reduce(checkSelectedReducer, false);

    if (!keywordSelected) setRowChecked(false);
  }, [selectedKeywords]);

  function toggleCollapse() {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) dispatch({ type: "SET_EXPANDED_ROW", rowId: group.id });
  }

  function handleRowCheck(checked) {
    setRowChecked(checked);

    if (checked) {
      setOpen(true);
      dispatch({ type: "ADD_KEYWORDS_SELECTED", keywords: group.keywords });
    } else {
      setOpen(false);
      dispatch({ type: "REMOVE_KEYWORDS_SELECTED", keywords: group.keywords });
    }
  }

  function handleKeywordCheck(checked, keyword) {
    if (checked) {
      if (!rowChecked) setRowChecked(true);
      dispatch({ type: "ADD_KEYWORDS_SELECTED", keywords: [keyword] });
    } else dispatch({ type: "REMOVE_KEYWORDS_SELECTED", keywords: [keyword] });
  }

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className={classes.groupRow}
      >
        <TableCell padding="checkbox">
          <Checkbox
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowChecked}
            onChange={(event) => handleRowCheck(event.target.checked)}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell className={classes.tableCellButton} onClick={toggleCollapse}>
          {group.lemma}
        </TableCell>
        <TableCell
          className={classes.tableCellButton}
          onClick={toggleCollapse}
          component="th"
          scope="row"
        >
          {group.keywords?.[0].name}
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={toggleCollapse}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          className={classes.innerRow}
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Keyword</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.keywords?.map((keyword) => (
                    <TableRow key={keyword.id}>
                      <TableCell
                        padding="checkbox"
                        style={{ borderBottom: "none" }}
                      >
                        <Checkbox
                          checked={keyword.id in selectedKeywords}
                          onChange={(event) =>
                            handleKeywordCheck(event.target.checked, keyword)
                          }
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ borderBottom: "none" }}
                      >
                        {keyword.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number,
    lemma: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default function KeywordTable(props) {
  const classes = useStyles();
  const { dataRows } = props;

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="collapsible table">
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>Stem</TableCell>
            <TableCell>Main Keyword</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {dataRows.map((row) => {
            return row && <Row key={row.id} row={row} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
