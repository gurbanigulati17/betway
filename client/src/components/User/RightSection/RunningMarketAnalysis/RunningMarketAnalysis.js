import React, { useEffect, useState } from "react";
import axios from "../../../../axios-instance/backendAPI";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import appTheme from "../../../../styles/theme";

export default function RunningMarketAnalysis() {
  const classes = useStyles();
  const [markets, setMarkets] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("/user/runningMarketAnalysis", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setMarkets(response.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let analysis = null;

  if (markets.length) {
    analysis = markets.map((market) => {
      return (
        <TableRow key={market.market_id}>
          <TableCell align="center">{market.market_id}</TableCell>
          <TableCell
            align="center"
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => {
              history.push("/fullmarket/" + market.event_id);
            }}
          >
            {market.event}
          </TableCell>
          <TableCell align="center">{market.market}</TableCell>
          <TableCell align="center">{market.sport}</TableCell>
          <TableCell>
            <div className={classes.currentPosition}>
              {market.runners.map((runner) => {
                return (
                  <div key={runner.selectionId}>
                    <p>
                      {runner.name}(
                      <span
                        style={{
                          fontWeight: "700",
                          color: runner.netProfit >= 0 ? "green" : "red",
                        }}
                      >
                        {runner.netProfit}
                      </span>
                      )
                    </p>
                  </div>
                );
              })}
            </div>
          </TableCell>
        </TableRow>
      );
    });
  } else {
    analysis = (
      <TableRow>
        <TableCell>No data</TableCell>
      </TableRow>
    );
  }

  return (
    <Paper className={classes.paper}>
      <div className={classes.titlePanel}>
        <span className={classes.title}>Running Market Analysis</span>
      </div>
      <TableContainer className={classes.container}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                style={{ fontWeight: "700" }}
                className={classes.head}
              >
                Market_Id
              </TableCell>
              <TableCell
                align="center"
                style={{ minWidth: "200px", fontWeight: "700" }}
                className={classes.head}
              >
                Event
              </TableCell>
              <TableCell
                align="center"
                style={{ minWidth: "90px", fontWeight: "700" }}
                className={classes.head}
              >
                Market
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "700" }}
                className={classes.head}
              >
                Sport
              </TableCell>
              <TableCell
                align="center"
                style={{ minWidth: "450px", fontWeight: "700" }}
                className={classes.head}
              >
                Current_Position
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{analysis}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
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
    margin: "-10px -10px 10px -10px",
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
  currentPosition: {
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "space-evenly",
  },
}));
