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
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  function toggleCollapse() {
    setOpen(!open);
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
            // checked={rowCount > 0 && numSelected === rowCount}
            // onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell className={classes.tableCellButton} onClick={toggleCollapse}>
          {row.id}
        </TableCell>
        <TableCell
          className={classes.tableCellButton}
          onClick={toggleCollapse}
          component="th"
          scope="row"
        >
          {row.name}
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
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Keyword</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { id: 4, name: "deep learning" },
                    { id: 10, name: "security" },
                  ].map((keyword) => (
                    <TableRow key={keyword.id}>
                      <TableCell
                        padding="checkbox"
                        style={{ borderBottom: "none" }}
                      >
                        <Checkbox />
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
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

export default function KeywordTable(props) {
  const classes = useStyles();
  const { dataRows } = props;

  const [state, dispatch] = useContext(Context);
  const { selectedKeywords } = state;

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
