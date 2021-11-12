import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { getHoverInteract } from "../utils";
import { Context } from "../Store";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import CircularProgress from "@material-ui/core/CircularProgress";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import CircleIcon from "@mui/icons-material/Circle";
import PriorityIcon from "@mui/icons-material/ArrowUpward";

import { makeStyles } from "@material-ui/core/styles";

const HOVER_DELAY = 4;

const useStyles = makeStyles((theme) => ({
  noDataContainer: {
    position: "absolute",
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tableContainer: {
    height: 570,
    // position: "relative",
  },
  tableBodyContainer: {
    height: 570,
    position: "relative",
  },
  tableHead: {
    zIndex: 2,
    height: 45,
    top: 0,
    position: "sticky",
    backgroundColor: theme.palette.pendingYellow.main,
    // backgroundColor: theme.palette.primary.main,
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
  const [cookies, _] = useCookies(["settings"]);
  const classes = useStyles();
  const { row: group, hoverTimer, setHoverTimer } = props;

  const [state, dispatch] = useContext(Context);
  const { selectedKeywords, expandedRowId } = state;

  const [open, setOpen] = useState(false);
  const [rowChecked, setRowChecked] = useState(false);

  const totalPriority = group.keywords?.reduce(
    (sum, k) => sum + (k.priority ?? 0),
    0
  );

  useEffect(() => {
    if (expandedRowId !== group.id) setOpen(false);
  }, [expandedRowId]);

  useEffect(() => {
    const checkSelectedReducer = (previousValue, currentValue) =>
      previousValue || currentValue in selectedKeywords;
    let keywordSelected = group.keywords
      .map((e) => e.id)
      .reduce(checkSelectedReducer, false);

    if (keywordSelected) setRowChecked(true);
    else setRowChecked(false);
  }, [selectedKeywords]);

  function toggleCollapse() {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) {
      clearTimeout(hoverTimer);
      dispatch({ type: "SET_EXPANDED_ROW", rowId: group.id });
      dispatch({ type: "SET_KEYWORD_INFO_ID", value: group.keywords[0].id });
    }
  }

  function handleKeywordHoverWithDelay(keywordId) {
    if (!getHoverInteract(cookies)) return;
    clearTimeout(hoverTimer);
    const timer = setTimeout(
      () => dispatch({ type: "SET_KEYWORD_INFO_ID", value: keywordId }),
      HOVER_DELAY * 1000
    );
    setHoverTimer(timer);
  }

  function handleRowHoverWithDelay() {
    if (!getHoverInteract(cookies)) return;
    clearTimeout(hoverTimer);
    const timer = setTimeout(() => {
      setOpen(true);
      dispatch({ type: "SET_EXPANDED_ROW", rowId: group.id });

      dispatch({ type: "SET_KEYWORD_INFO_ID", value: group.keywords[0].id });
    }, HOVER_DELAY * 1000);
    setHoverTimer(timer);
  }

  function handleHoverLeave() {
    clearTimeout(hoverTimer);
  }

  function handleKeywordClick(keywordId) {
    clearTimeout(hoverTimer);
    dispatch({ type: "SET_KEYWORD_INFO_ID", value: keywordId });
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
        onMouseEnter={handleRowHoverWithDelay}
        onMouseLeave={handleHoverLeave}
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
        <TableCell
          className={classes.tableCellButton}
          onClick={toggleCollapse}
          component="th"
          scope="row"
        >
          <div style={{ display: "inline-block" }}>
            {group.keywords?.[0].name}
          </div>
          {totalPriority > 0 && (
            <Tooltip title="high priority" placement="right">
              <PriorityIcon
                style={{
                  color: "orange",
                  fontSize: 17,
                  marginLeft: 3,
                }}
              />
            </Tooltip>
          )}
        </TableCell>
        <TableCell className={classes.tableCellButton} onClick={toggleCollapse}>
          {group.lemma}
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
                    <TableRow
                      key={keyword.id}
                      onMouseEnter={() =>
                        handleKeywordHoverWithDelay(keyword.id)
                      }
                      onMouseLeave={handleHoverLeave}
                    >
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
                        className={classes.tableCellButton}
                        onClick={() => handleKeywordClick(keyword.id)}
                      >
                        {keyword.name}
                        {keyword.priority > 0 && (
                          <CircleIcon
                            style={{
                              color: "orange",
                              fontSize: 8,
                              marginLeft: 6,
                            }}
                          />
                        )}
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
  // const { dataRows } = props;

  const [state, dispatch] = useContext(Context);
  const { selectedKeywords, tableLoading, keywordTableOpts: dataRows } = state;

  const [rowHoverTimer, setRowHoverTimer] = useState();
  const [allChecked, setAllChecked] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const curPageRows = dataRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    if (selectedKeywords.length === 0) setAllChecked(false);
  }, [selectedKeywords]);

  function handleTableCheck(checked) {
    setAllChecked(checked);

    if (checked)
      dispatch({ type: "SELECT_FULL_TABLE", tableRows: curPageRows });
    else dispatch({ type: "CLEAR_ALL_SELECTED" });
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  // Check if at least one row;
  const showData = curPageRows?.length > 0;

  return (
    <div>
      <TableContainer
        className={showData ? classes.tableContainer : null}
        component={Paper}
      >
        <Table
          className={showData ? null : classes.tableBodyContainer}
          size="small"
          aria-label="collapsible table"
        >
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allChecked}
                  onChange={(event) => handleTableCheck(event.target.checked)}
                />
              </TableCell>
              <TableCell>Top Keyword</TableCell>
              <TableCell>Group Root</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          {!showData ? (
            <div className={classes.noDataContainer}>
              {tableLoading ? (
                <CircularProgress />
              ) : (
                <Typography>No rows</Typography>
              )}
            </div>
          ) : (
            <TableBody>
              {curPageRows.map((row) => {
                return (
                  row && (
                    <Row
                      key={row.id}
                      row={row}
                      hoverTimer={rowHoverTimer}
                      setHoverTimer={setRowHoverTimer}
                    />
                  )
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={dataRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
