import React, { useState, useEffect } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  Paper,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../../../../../axios-instance/backendAPI";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 10px",
    backgroundColor: "#4a4a4a",
    color: "#FFF",
    fontWeight: "bold",
  },
  action: {
    cursor: "pointer",
  },
  total: {
    fontWeight: "700",
  },
}));

export default function MarketAnalysis(props) {
  const classes = useStyles();
  const [runners, setRunners] = useState([]);
  const [marketAnalysis, setMarketAnalysis] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    getRunners();
    getMarketAnalysis();
  }, [props.marketId, update, props.username]);

  const getRunners = () => {
    axios
      .get("/user/getRunnersByMarket/" + props.marketId, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setRunners(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMarketAnalysis = () => {
    axios
      .get(
        "/user/getMarketAnalysis/" +
          props.eventId +
          "/" +
          props.marketId +
          "/" +
          props.username +
          "/" +
          props.usertype,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setMarketAnalysis(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeUpdate = () => {
    let prevValue = update;
    setUpdate(!prevValue);
  };

  let head = null,
    body = null,
    total = [];
  if (runners.length) {
    runners.forEach((element) => {
      total.push(0);
    });

    head = (
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          {runners
            .sort((a, b) => a.selectionId - b.selectionId)
            .map((runner) => {
              return (
                <TableCell key={runner.selectionId}>{runner.name}</TableCell>
              );
            })}
        </TableRow>
      </TableHead>
    );

    body = (
      <TableBody>
        {marketAnalysis.length
          ? marketAnalysis.map((user) => {
              let i = 0;

              if (user.runners) {
                user.runners = user.runners.sort(
                  (a, b) => a.selectionId - b.selectionId
                );
              }

              return (
                <TableRow
                  style={{ cursor: "pointer", fontSize: "0.7rem" }}
                  key={user.downlink}
                >
                  <TableCell
                    onClick={() => {
                      props.ahead(user.downlink);
                    }}
                  >
                    {user.downlink}
                  </TableCell>
                  {user.runners
                    ? user.runners.map((runner) => {
                        total[i] = total[i] + runner.netProfit;
                        i++;
                        return (
                          <TableCell
                            key={runner.selectionId}
                            style={{
                              fontWeight: "900",
                              color: runner.netProfit >= 0 ? "green" : "red",
                            }}
                          >
                            {runner.netProfit}
                          </TableCell>
                        );
                      })
                    : null}
                </TableRow>
              );
            })
          : null}
        <TableRow>
          <TableCell className={classes.total}>Total</TableCell>
          {total.map((runnerTotal, index) => {
            return (
              <TableCell
                key={index}
                style={{
                  fontWeight: "900",
                  color: runnerTotal >= 0 ? "green" : "red",
                }}
              >
                {runnerTotal}
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    );
  }

  return (
    <div>
      <div className={classes.root}>
        <div
          className={classes.action}
          onClick={() => {
            changeUpdate();
          }}
        >
          Current Position <i className="fas fa-sync"></i>
        </div>
        <div
          className={classes.action}
          onClick={() => {
            props.back();
          }}
        >
          <i className="fas fa-backspace"></i> Back
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          {head}
          {body}
        </Table>
      </TableContainer>
    </div>
  );
}
