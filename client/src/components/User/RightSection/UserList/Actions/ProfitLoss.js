import React, { useState, useEffect } from "react";
import DateTime from "../../../../UI/DateTime/DateTime";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import axios from "../../../../../axios-instance/backendAPI";
import moment from "moment";
import BetHistory from "../../BetHistory/BetHistory";
import { useParams } from "react-router-dom";
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
  let headCells = [
    {
      id: "event",
      numeric: false,
      disablePadding: false,
      label: "Event",
    },
    {
      id: "market",
      numeric: true,
      disablePadding: false,
      label: "Market",
    },
    {
      id: "Profit_Loss",
      numeric: true,
      disablePadding: false,
      label: "Profit/Loss",
    },
    {
      id: "winner",
      numeric: true,
      disablePadding: false,
      label: "Declared",
    },
    {
      id: "settled_at",
      numeric: true,
      disablePadding: false,
      label: "Settled_At",
    },
    {
      id: "action",
      numeric: true,
      disablePadding: false,
      label: "Action",
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

export default function UserProfitLoss() {
  const classes = useStyles();
  const params = useParams();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("website");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [bufferRows, setBufferRows] = useState([]);
  const [search, setSearch] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [bets, setBets] = useState(false);
  const [eventInfo, setEventInfo] = useState(null);
  const [fromTo, setFromTo] = useState(null);
  const [dateCache, setDateCache] = useState(null);
  const onSubmit = (from, to, value) => {
    let fromDate = from;
    let toDate = to;

    if (dateCache) {
      fromDate = dateCache.from;
      toDate = dateCache.to;
      setDateCache(null);
    }

    axios
      .get(
        "/user/userProfitLoss/" +
          fromDate +
          "/" +
          toDate +
          "/" +
          params.username +
          "/" +
          value,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setBufferRows(response.data.data);
          setTotal(response.data.total);

          const cur_date = {
            from: from,
            to: to,
          };
          setFromTo(cur_date);
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

  const showBets = (event, market, eventId) => {
    const cur_event = {
      event: event,
      market: market,
      eventId: eventId,
      username: params.username,
    };
    setEventInfo(cur_event);
    setBets(true);
    setDateCache(fromTo);
  };

  const filter = [
    { value: "All", label: "All" },
    { value: "Cricket", label: "Cricket" },
    { value: "Soccer", label: "Soccer" },
    { value: "Tennis", label: "Tennis" },
  ];

  const columns = [
    {
      id: "event",
      align: "left",
      minWidth: 500,
    },
    {
      id: "market",
      align: "center",
      minWidth: 300,
    },
    {
      id: "Profit_Loss",
      align: "center",
    },
    {
      id: "winner",
      align: "center",
    },
    {
      id: "settled_at",
      align: "center",
      minWidth: 200,
    },
    {
      id: "action",
      align: "center",
      minWidth: 200,
    },
  ];

  let table = (
    <>
      <div className={classes.card}>
        <DateTime
          filter={filter}
          onSubmit={onSubmit}
          search={search}
          dateCache={dateCache}
        />
      </div>
      <Paper className={classes.paper}>
        <div className={classes.titlePanel}>
          <span className={classes.title}>Profit Loss Listing</span>
        </div>
        <div className={classes.root}>
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
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.market + row.event}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                padding="none"
                                className={
                                  column.id === "event"
                                    ? classes.cell
                                    : classes.smallCell
                                }
                              >
                                {column.id === "settled_at" ? (
                                  moment(value).format("DD-MM-YYYY HH:mm:ss")
                                ) : column.id === "action" ? (
                                  <p
                                    style={{ cursor: "pointer", color: "blue" }}
                                    onClick={() => {
                                      showBets(
                                        row.event,
                                        row.market,
                                        row.event_id
                                      );
                                    }}
                                  >
                                    Show Bets
                                  </p>
                                ) : (
                                  value
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  <TableRow>
                    <TableCell colSpan="2" style={{ fontWeight: "700" }}>
                      Total
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "700",
                        color: total >= 0 ? "green" : "red",
                      }}
                      align="center"
                    >
                      {total.toFixed(2)}
                    </TableCell>
                    <TableCell colSpan="2"></TableCell>
                  </TableRow>
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
        </div>
      </Paper>
    </>
  );

  if (bets) {
    table = (
      <BetHistory
        eventInfo={eventInfo}
        fromTo={fromTo}
        flag={1}
        back={
          <div className={classes.backWrapper}>
            <button
              className={`${classes.back} btn btn-primary`}
              onClick={() => {
                setBets(false);
              }}
            >
              Back
            </button>
          </div>
        }
      />
    );
  }

  return table;
}
