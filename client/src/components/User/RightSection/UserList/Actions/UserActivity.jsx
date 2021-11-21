import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DateTime from "../../../../UI/DateTime/DateTime";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import axios from "../../../../../axios-instance/backendAPI";
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

import { sectionStyle } from "../../../../../utils/common.style";

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
  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Name",
    },
    {
      id: "IP_Address",
      numeric: false,
      disablePadding: false,
      label: "IP_Address",
    },
    {
      id: "action",
      numeric: false,
      disablePadding: false,
      label: "Action",
    },
    {
      id: "time",
      numeric: false,
      disablePadding: false,
      label: "Time_Of_Action",
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "location",
      numeric: false,
      disablePadding: false,
      label: "Location",
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

export default function UserActivity() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("website");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [bufferRows, setBufferRows] = useState([]);
  const [search, setSearch] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const params = useParams();

  const onSubmit = (from, to, value) => {
    axios
      .get("/user/UserActivity/" + params.username + "/" + from + "/" + to, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.data) {
          setBufferRows(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const filter = [];

  const columns = [
    {
      id: "name",
      align: "center",
      minWidth: "250px",
    },
    {
      id: "IP_Address",
      align: "center",
    },
    {
      id: "action",
      align: "center",
    },
    {
      id: "time",
      align: "center",
      minWidth: "150px",
    },
    {
      id: "status",
      align: "center",
    },
    {
      id: "location",
      align: "center",
      minWidth: "400px",
    },
  ];

  return (
    <>
      <div className={classes.card}>
        <DateTime filter={filter} onSubmit={onSubmit} />
      </div>
      <Paper className={classes.paper}>
        <div className={classes.titlePanel}>
          <span className={classes.title}>
            {"Login activity of " + params.username}
          </span>
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
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {!rows.length ? (
                <TableRow>
                  <TableCell colSpan="6">No data</TableCell>
                </TableRow>
              ) : null}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.time}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            padding="default"
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.id === "time"
                              ? moment(value).format("DD-MM-YYYY HH:mm:ss")
                              : column.id === "location"
                              ? row.region + " " + row.city + "," + row.country
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
