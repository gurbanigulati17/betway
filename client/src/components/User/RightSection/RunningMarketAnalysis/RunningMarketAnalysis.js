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
import { Link } from "react-router-dom";

import { sectionStyle } from "../../../../utils/common.style";

export default function RunningMarketAnalysis() {
  const classes = useStyles();
  const [markets, setMarkets] = useState([]);

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
          <TableCell align="center">
            <Link
              to={`/fullmarket/${market.event_id}`}
              className={classes.linkText}
            >
              {market.event}
            </Link>
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
  ...sectionStyle(theme),
  currentPosition: {
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "space-evenly",
  },
}));
