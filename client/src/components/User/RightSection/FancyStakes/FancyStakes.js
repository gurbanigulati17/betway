import React, { useState, useEffect } from "react";
import DateTime from "../../../UI/DateTime/DateTime";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import axios from "../../../../axios-instance/backendAPI";
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
import { useHistory } from "react-router-dom";

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
  const userInfo = [
    { type: "Seniorsuper", usertype: 2 },
    { type: "Supermaster", usertype: 3 },
    { type: "Master", usertype: 4 },
    { type: "Client", usertype: 5 },
  ];

  const headCells = [
    {
      id: "username",
      disablePadding: false,
      numeric: true,
      label: userInfo.filter(
        (user) => user.usertype === parseFloat(props.usertype) + 1
      )[0]?.type,
    },
    {
      id: "amount",
      numeric: false,
      disablePadding: false,
      label: "Total Stakes",
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

export default function FancyStakes(props) {
  const classes = useStyles();
  const history = useHistory();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("website");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [bufferRows, setBufferRows] = useState([]);
  const [search, setSearch] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const usertype = useSelector((state) => state.auth.usertype);
  const username = useSelector((state) => state.auth.username);
  const [userInfo, setUserInfo] = useState({ username: "", usertype: "" });
  const [userHistory, setUserHistory] = useState([]);
  const [total, setTotal] = useState(0);

  const ahead = (username) => {
    if (userHistory.length !== 4) {
      let users = [...userHistory];
      users.push(username);
      setUserHistory(users);
      getUserInfo(username);
    }
  };

  const back = () => {
    if (userHistory.length !== 1) {
      const users = [...userHistory];
      users.pop();
      getUserInfo(users[users.length - 1]);
      setUserHistory([...users]);
    } else {
      history.goBack();
    }
  };

  const getUserInfo = (username) => {
    axios
      .get("/user/userBalanceInfo/" + username, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          const user = {
            username: response.data.data[0].username,
            usertype: response.data.data[0].usertype,
          };
          setUserInfo(user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const myInfo = () => {
    const user = {
      username: username,
      usertype: usertype,
    };
    setUserInfo(user);
    const cur_user = [];
    cur_user.push(username);
    setUserHistory(cur_user);
  };

  const onSubmit = (from, to, value) => {
    if (userInfo.username.length) {
      axios
        .get("/user/fancyStakes/" + from + "/" + to + "/" + userInfo.username, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((response) => {
          if (response.data.success) {
            setTotal(response.data.total);
            setBufferRows(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    if (username && !userHistory.length) {
      myInfo();
    }
  }, [username]);

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
      id: "username",
      align: "center",
    },
    {
      id: "amount",
      align: "center",
    },
  ];
  return (
    <>
      <div className={classes.card}>
        <DateTime filter={filter} onSubmit={onSubmit} userInfo={userInfo} />
      </div>
      <Paper className={classes.paper}>
        <div className={classes.titlePanel}>
          <span className={classes.title}>Fancy Stakes</span>
        </div>
        <div className={classes.backWrapper}>
          <button
            className={`${classes.back} btn btn-primary`}
            onClick={() => {
              back();
            }}
          >
            Back
          </button>
        </div>
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
                usertype={userInfo.usertype}
              />
              <TableBody>
                {!rows?.length ? (
                  <TableRow>
                    <TableCell colSpan="2">No data</TableCell>
                  </TableRow>
                ) : null}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={row.username}>
                        {columns.map((column, colIndex) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              width={column.minWidth}
                            >
                              {column.id === "username" ? (
                                <span
                                  style={{
                                    color:
                                      userInfo.usertype === "4"
                                        ? "black"
                                        : "blue",
                                    cursor:
                                      userInfo.usertype === "4"
                                        ? "default"
                                        : "pointer",
                                  }}
                                  onClick={() => {
                                    ahead(value);
                                  }}
                                >
                                  {value}
                                </span>
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
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Total
                  </TableCell>
                  <TableCell align="center">
                    <span style={{ fontWeight: "bold" }}>{total}</span>
                  </TableCell>
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
        </div>
      </Paper>
    </>
  );
}
