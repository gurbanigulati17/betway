import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../../../axios-instance/backendAPI";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  InputBase,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { useParams } from "react-router";

import appTheme from "../../../../styles/theme";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  let headCells = [
    {
      id: "bet_id",
      numeric: true,
      disablePadding: false,
      label: "BetId",
    },
    {
      id: "event",
      numeric: true,
      disablePadding: false,
      label: "Event",
    },
    {
      id: "seniorsuper",
      numeric: true,
      disablePadding: false,
      label: "Seniorsuper",
    },
    {
      id: "supermaster",
      numeric: true,
      disablePadding: false,
      label: "Supermaster",
    },
    {
      id: "master",
      numeric: true,
      disablePadding: false,
      label: "Master",
    },
    {
      id: "client",
      numeric: true,
      disablePadding: false,
      label: "Client",
    },
    {
      id: "runner",
      numeric: true,
      disablePadding: false,
      label: "Runner",
    },
    {
      id: "odds",
      numeric: true,
      disablePadding: false,
      label: "Odds",
    },
    {
      id: "selection",
      numeric: true,
      disablePadding: false,
      label: "Selection",
    },
    {
      id: "stake",
      numeric: true,
      disablePadding: false,
      label: "Stake",
    },
    {
      id: "sport",
      numeric: true,
      disablePadding: false,
      label: "Sport",
    },
    {
      id: "placed_at",
      numeric: true,
      disablePadding: false,
      label: "Placed_At",
    },
  ];
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.heading}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {/* {order === 'desc' ? 'sorted descending' : 'sorted ascending'} */}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  search: {
    position: "relative",
    border: "1px solid #d2d6de",
    float: "right",
    margin: "5px 0",
    width: 220,
    "& input": {
      width: "100%",
      paddingLeft: 40,
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    margin: 3,
    cursor: "pointer",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  box: {
    display: "grid",
    gridTemplateColumns: "95% 5%",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "90% 10%",
    },
  },
  back: {
    marginTop: 10,
    float: "right",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    backgroundColor: "#f5f5f5",
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      margin: -10,
      width: "initial",
      padding: 20,
    },
  },
  container: {
    overflow: "auto",
    maxHeight: 440,
  },
  table: {
    overflow: "scroll",
    border: "solid 1px #bdc3c7",
    backgroundColor: "#FFFFFF",
    "& thead th": {
      padding: "6px 12px",
      color: "rgba(0,0,0,.54)",
      font: '600 12px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      backgroundColor: "#f5f7f7",
      position: "relative",
    },
    "& thead th::before": {
      borderRight: "1px solid rgba(189,195,199,.5)",
      content: "''",
      height: 16,
      marginTop: 8,
      position: "absolute",
      left: 0,
      textIndent: 2000,
      top: 0,
    },
    "& thead th:first-child::before": {
      content: "none",
    },
    "& tbody td": {
      font: '400 12px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      padding: "0 12px",
      color: "rgba(0,0,0)",
      lineHeight: "32px",
      borderBottom: "solid 1px #d9dcde",
    },
    "& tbody td p": {
      margin: 0,
    },
    "& tbody td button": {
      marginTop: "5px !important",
      marginBottom: "5px !important",
    },
  },
  titlePanel: {
    background: appTheme.colors.primary,
    color: appTheme.colors.textLight,
    fontWeight: 700,
    border: 0,
    margin: "-10px -10px 0 -10px",
    minHeight: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  title: {
    marginRight: "10px",
    fontSize: 14,
    fontFamily: "inherit",
    textTransform: "uppercase",
    fontWeight: 700,
  },
}));

export default function ExposureBets() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("website");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [bufferRows, setBufferRows] = useState([]);
  const [search, setSearch] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [value, setValue] = React.useState("All");
  const params = useParams();

  useEffect(() => {
    axios
      .get("/user/getExposureBets/" + params.username, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (value === "fancy") {
          response.data.data = response.data.data.filter(
            (row) => row.type === value
          );
        } else if (value !== "All") {
          response.data.data = response.data.data.filter(
            (row) => row.sport === value
          );
        }
        setBufferRows(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [value]);

  useEffect(() => {
    const columns = bufferRows[0] && Object.keys(bufferRows[0]);
    let newRows = search
      ? bufferRows.filter((bufferRow) =>
          columns.some(
            (column) =>
              bufferRow[column]
                ?.toString()
                .toLowerCase()
                .indexOf(search.toLowerCase()) > -1
          )
        )
      : bufferRows;

    setRows(newRows);
  }, [search, bufferRows]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filter = [
    { value: "All", label: "All" },
    { value: "Cricket", label: "Cricket" },
    { value: "Soccer", label: "Soccer" },
    { value: "Tennis", label: "Tennis" },
    { value: "fancy", label: "Fancy" },
  ];

  const columns = [
    {
      id: "bet_id",
      align: "center",
    },
    {
      id: "event",
      align: "center",
      minWidth: "250px",
    },
    {
      id: "seniorsuper",
      align: "center",
    },
    {
      id: "supermaster",
      align: "center",
    },
    {
      id: "master",
      align: "center",
    },
    {
      id: "client",
      align: "center",
    },
    {
      id: "runner",
      align: "center",
      minWidth: "250px",
    },
    {
      id: "odds",
      align: "center",
    },
    {
      id: "selection",
      align: "center",
    },
    {
      id: "stake",
      align: "center",
    },
    {
      id: "sport",
      align: "center",
    },
    {
      id: "placed_at",
      align: "center",
      minWidth: 200,
    },
  ];

  return (
    <Paper className={classes.paper}>
      <div className={classes.titlePanel}>
        <span className={classes.title}>Current Bets</span>
      </div>
      <FormControl component="fieldset" className={classes.form}>
        <RadioGroup
          row
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}
        >
          {filter.map((obj) => {
            return (
              <FormControlLabel
                value={obj.value}
                control={<Radio />}
                label={obj.label}
                key={obj.value}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      <Paper className={classes.paper}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>

          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onChange={handleSearch}
            inputProps={{ "aria-label": "search" }}
          />
        </div>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              onRequestSort={handleRequestSort}
              classes={classes}
              order={order}
              orderBy={orderBy}
              rowCount={rows.length}
            />
            <TableBody>
              {!rows.length ? (
                <TableRow>
                  <TableCell colSpan="12">No data</TableCell>
                </TableRow>
              ) : null}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.bet_id}
                      style={{
                        backgroundColor:
                          row.state === "void"
                            ? "red"
                            : row.selection === "back"
                            ? "skyblue"
                            : "pink",
                      }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];

                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            padding="none"
                            style={{
                              minWidth: column.minWidth,
                              padding: "3px 0",
                            }}
                          >
                            {column.id === "event"
                              ? row.type !== "fancy"
                                ? value + "/" + row.market
                                : value
                              : column.id === "runner"
                              ? row.type === "fancy"
                                ? value + "/" + row.user_rate
                                : value
                              : column.id === "placed_at"
                              ? moment(value).format("DD-MM-YYYY HH:mm:ss")
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </Paper>
  );
}
