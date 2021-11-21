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
} from "@material-ui/core";
import { useParams } from "react-router";

import { sectionStyle } from "../../../../utils/common.style";

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

const useStyles = makeStyles(sectionStyle);

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
    <>
      <div className={classes.card}>
        {!!filter?.length && (
          <select
            value={value}
            onChange={handleChange}
            className="formInputTheme"
          >
            {filter.map((obj) => {
              return (
                <option value={obj.value} key={obj.value}>
                  {obj.label}
                </option>
              );
            })}
          </select>
        )}
      </div>
      <Paper className={classes.paper}>
        <div className={classes.titlePanel}>
          <span className={classes.title}>Current Bets</span>
        </div>
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
    </>
  );
}
