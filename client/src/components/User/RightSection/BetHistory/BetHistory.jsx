import React, { useState, useEffect } from "react";
import DateTime from "../../../UI/DateTime/DateTime";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
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

import appTheme from "../../../../styles/theme";
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
  const usertype = useSelector((state) => state.auth.usertype);

  let betHeadCells = [
    {
      id: "event",
      numeric: false,
      disablePadding: false,
      label: "Event",
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
      id: "profit_loss",
      numeric: true,
      disablePadding: false,
      label: "Profit/Loss",
    },
    {
      id: "sport",
      numeric: true,
      disablePadding: false,
      label: "Sport",
    },
    {
      id: "state",
      numeric: true,
      disablePadding: false,
      label: "State",
    },
    {
      id: "IP_Address",
      numeric: true,
      disablePadding: false,
      label: "IP_Address",
    },
    {
      id: "placed_at",
      numeric: true,
      disablePadding: false,
      label: "Placed_At",
    },
    {
      id: "settled_at",
      numeric: true,
      disablePadding: false,
      label: "Settled_At",
    },
  ];

  const users = [
    {
      id: "seniorsuper",
      disablePadding: false,
      label: "Seniorsuper",
    },
    {
      id: "supermaster",
      disablePadding: false,
      label: "supermaster",
    },
    {
      id: "master",
      disablePadding: false,
      label: "Master",
    },
    {
      id: "username",
      disablePadding: false,
      label: "Username",
    },
  ];
  users.splice(0, parseFloat(usertype - 1));

  const headCells = [
    {
      id: "bet_id",
      numeric: false,
      disablePadding: false,
      label: "Bet_Id",
    },
    ...users,
    ...betHeadCells,
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

export default function BetHistory(props) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("website");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [bufferRows, setBufferRows] = useState([]);
  const [search, setSearch] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const usertype = useSelector((state) => state.auth.usertype);

  const onSubmit = (from, to, value) => {
    axios
      .get("/user/betHistory/" + from + "/" + to, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
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
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (props.flag === 1) {
      const payload = {
        from: props.fromTo.from,
        to: props.fromTo.to,
        event: props.eventInfo.event,
        market: props.eventInfo.market,
        username: props.eventInfo.username,
        eventId: props.eventInfo.eventId,
      };

      axios
        .post("/user/showBetHistory", payload, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((response) => {
          setBufferRows(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

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

  const filter = [
    { value: "All", label: "All" },
    { value: "Cricket", label: "Cricket" },
    { value: "Soccer", label: "Soccer" },
    { value: "Tennis", label: "Tennis" },
    { value: "fancy", label: "Fancy" },
  ];

  const betColumns = [
    {
      id: "event",
      align: "left",
      minWidth: 500,
    },
    {
      id: "runner",
      align: "center",
      minWidth: 300,
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
      id: "profit_loss",
      align: "center",
    },
    {
      id: "sport",
      align: "center",
    },
    {
      id: "state",
      align: "center",
    },
    {
      id: "IP_Address",
      align: "center",
    },
    {
      id: "placed_at",
      align: "center",
      minWidth: 200,
    },
    {
      id: "settled_at",
      align: "center",
      minWidth: 200,
    },
  ];

  const users = [
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
      id: "username",
      align: "center",
    },
  ];

  users.splice(0, parseFloat(usertype - 1));

  const columns = [
    {
      id: "bet_id",
      align: "center",
    },
    ...users,
    ...betColumns,
  ];

  return (
    <>
      {props.flag === 1 ? null : (
        <div className={classes.card}>
          <DateTime filter={filter} onSubmit={onSubmit} />
        </div>
      )}
      <Paper className={classes.paper}>
        <div className={classes.titlePanel}>
          <span className={classes.title}>Bet History</span>
        </div>
        {props.back}
        <div className={classes.root}>
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
                {!rows?.length ? (
                  <TableRow>
                    <TableCell colSpan="16">No data</TableCell>
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
                              ? "#b0d8f5"
                              : "#f9c2ce",
                        }}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              padding="none"
                              width={column.minWidth}
                            >
                              {column.id === "event"
                                ? row.type !== "fancy"
                                  ? value + "/" + row.market
                                  : value
                                : column.id === "runner"
                                ? row.type === "fancy"
                                  ? value + "/" + row.user_rate
                                  : value
                                : column.id === "placed_at" ||
                                  column.id === "settled_at"
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
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </>
  );
}
