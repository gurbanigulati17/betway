import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@material-ui/core";
import DateTime from "../../../../UI/DateTime/DateTime";
import axios from "../../../../../axios-instance/backendAPI";
import { useLocation } from "react-router-dom";
import moment from "moment";
import BetHistory from "../../BetHistory/BetHistory";

import appTheme from "../../../../../styles/theme";

const columns = [
  {
    id: "created_at",
    label: "Date",
    align: "right",
  },
  {
    id: "description",
    label: "Description",
    align: "left",
  },
  {
    id: "deposited",
    label: "Credit",
    minWidth: 140,
    align: "right",
  },
  {
    id: "withdrawn",
    label: "Debit",
    minWidth: 140,
    align: "right",
  },
  {
    id: "balance",
    label: "Balance",
    minWidth: 170,
    align: "right",
  },
];

export default function AccountStatement() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setrows] = useState([]);
  const location = useLocation();
  const [bets, setBets] = useState(false);
  const [eventInfo, setEventInfo] = useState(null);
  const [fromTo, setFromTo] = useState(null);
  const [dateCache, setDateCache] = useState(null);
  const [userInfo, setUserInfo] = useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };
  const trimDes = (value, type) => {
    let index = value.length;

    if (type === "pl") {
      index = value.lastIndexOf("//");
    }

    return value.slice(0, index);
  };
  const showBet = (value) => {
    const query = new URLSearchParams(location.search);
    let username;

    for (let param of query.entries()) {
      if (param[0] === "username") {
        username = param[1];
      }
    }

    let event = value.split("//")[3];
    let market = value.split("//")[4];
    let eventId = value.split("//")[value.split("//").length - 1];

    const cur_event = {
      event: event,
      market: market,
      username: username,
      eventId: eventId,
    };

    setEventInfo(cur_event);
    setBets(true);
    setDateCache(fromTo);
  };

  const onSubmit = (from, to, value) => {
    let fromDate = from;
    let toDate = to;

    if (dateCache) {
      fromDate = dateCache.from;
      toDate = dateCache.to;
      setDateCache(null);
    }

    const query = new URLSearchParams(location.search);
    let username, usertype;

    for (let param of query.entries()) {
      if (param[0] === "username") {
        username = param[1];
      } else if (param[0] === "usertype") {
        usertype = param[1];
      }
    }

    axios
      .get(
        "/user/userAccountStatement/" +
          value +
          "/" +
          username +
          "/" +
          usertype +
          "/" +
          fromDate +
          "/" +
          toDate,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setrows(response.data.data);
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
    const query = new URLSearchParams(location.search);
    let username, usertype;
    for (let param of query.entries()) {
      if (param[0] === "username") {
        username = param[1];
      } else if (param[0] === "usertype") {
        usertype = param[1];
      }
    }
    setUserInfo({ username: username, usertype: usertype });
  }, [location.search]);

  const filter = [
    { value: "All", label: "All" },
    { value: "fc", label: "Free Chips" },
    { value: "se", label: "Settlement" },
    { value: "pl", label: "Profit Loss" },
  ];

  let table = (
    <Paper className={classes.paper}>
      <div className={classes.titlePanel}>
        <span className={classes.title}>Account summary</span>
      </div>
      <DateTime
        onSubmit={onSubmit}
        filter={filter}
        dateCache={dateCache}
        userInfo={userInfo}
      />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.head}>
                S.No.
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className={classes.head}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!rows?.length ? (
              <TableRow>
                <TableCell colSpan="6">No data</TableCell>
              </TableRow>
            ) : null}
            {rows
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index + 1}>
                    <TableCell key={index + 1} align="center">
                      {index + 1}
                    </TableCell>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return column.id === "created_at" ? (
                        <TableCell key={column.id} align={column.align}>
                          {moment(value).format("DD-MM-YYYY HH:mm:ss")}
                        </TableCell>
                      ) : (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            color:
                              column.id === "description" ? "blue" : "black",
                            cursor:
                              column.id === "description" ? "pointer" : "auto",
                          }}
                          onClick={() => {
                            if (
                              column.id === "description" &&
                              value.includes("//")
                            ) {
                              showBet(value);
                            }
                          }}
                        >
                          {column.id === "description"
                            ? trimDes(value, row.type)
                            : column.format && typeof value === "number"
                            ? column.format(value)
                            : !value
                            ? "-"
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
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={rows?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );

  if (bets) {
    table = (
      <Paper className={classes.paper}>
        <BetHistory eventInfo={eventInfo} fromTo={fromTo} flag={1} />
      </Paper>
    );
  }

  return (
    <>
      <div>
        {bets ? (
          <p
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: "12px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Bet history</span>
            <span
              style={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => {
                setBets(false);
              }}
            >
              Back
            </span>
          </p>
        ) : null}
      </div>
      {table}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
