import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableContainer,
} from "@material-ui/core";
import axios from "../../../../axios-instance/backendAPI";
import odds_axios from "../../../../axios-instance/oddsApi";
import EventRow from "../Dashboard/Event/EventRow";
import { makeStyles } from "@material-ui/core/styles";
import BetSpinner from "../../../UI/Spinner/BetSpinner";

import appTheme from "../../../../styles/theme";

const useStyles = makeStyles((theme) => ({
  inplay: {
    paddingBottom: 0,
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 0,
    },
  },
  root: {
    overflow: "initial",
    marginTop: 0,
    marginBottom: 20,
    background: "#FFF",
  },
  head: {
    display: "flex",
    flexWrap: "wrap",
    background: "#dddcd6",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  body: {
    border: "1px solid #c8ced3",
  },
  match: {
    width: "70%",
    padding: 3,
    fontSize: 11,
    cursor: "pointer",
    fontFamily: appTheme.font.family,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      border: "none",
      display: "none",
    },
    lineHeight: 1,
  },
  tableCell: {
    width: "10%",
    padding: 3,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: appTheme.font.family,
    fontWeight: "bold",
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      width: "33.33%",
      background: "#7a7a7a",
      borderRight: "solid 1px #FFF",
      color: "#FFF",
    },
    lineHeight: 1,
  },
  eventTitle: {
    background: "linear-gradient(-180deg, #2E4B5E 0%, #243A48 82%)",
    color: "#fff",
    fontSize: 14,
    lineHeight: 1,
    fontWeight: 700,
    padding: 10,
    margin: 0,
    cursor: "pointer",
  },
  noInPlay: {
    padding: 50,
    textAlign: "center",
    bordeRadius: 5,
    border: "dashed 5px #DDD",
    width: "70%",
    margin: "50px auto 0",
    fontSize: 30,
    fontWeight: "bold",
    color: "#bdbdbd",
  },
}));

const Inplay = (props) => {
  const classes = useStyles();
  const [matches, setMatches] = useState();
  const [marketIds, setMarketIds] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const ref = useRef(false);

  function getOdds() {
    if (marketIds.length) {
      odds_axios
        .get("/getOdds/" + marketIds)
        .then((response) => {
          if (response.data.success) {
            let allMatches = [...matches];

            for (let match of allMatches) {
              let odds = response.data.data.filter(
                (odd) => odd.marketId === match.marketId
              );
              match.odds = odds;
            }

            if (props.index === props.activeIndex) {
              setMatches(allMatches);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  useEffect(() => {
    setLoading(true);
    axios
      .get("/user/getInplayMatches", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          if (!response.data.data.length) {
            setMatches([]);
          } else {
            let marketIds = "";

            for (let market of response.data.data) {
              marketIds =
                marketIds + (marketIds === "" ? "" : ",") + market.marketId;
            }

            if (props.index === props.activeIndex) {
              setMarketIds(marketIds);
              setMatches(response.data.data);
            }
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (matches && matches.length) {
      if (ref.current === false) {
        ref.current = true;
        getOdds();
        setIntervalId(setInterval(getOdds, 5000));
      }
    }
  }, [matches, marketIds]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [intervalId]);

  let allMatches = null;
  let cricket = null;
  let soccer = null;
  let tennis = null;

  if (matches && matches.length) {
    cricket = matches
      .filter((match) => match.sport === "4")
      .map((match, index) => {
        return (
          <EventRow
            key={match.marketId}
            marketId={match.marketId}
            marketStartTime={match.marketStartTime}
            name={match.matchName}
            matchId={match.matchId}
            sport={props.id}
            cupRate={match.cupRate}
            odds={match.odds && match.odds.length ? match.odds[0] : ""}
            inplay={true}
            isHighlighted={(index + 1) % 2 === 0}
            noOfRunners={
              match.odds && match.odds.length
                ? match.odds[0].runners
                  ? match.odds[0].runners.length
                  : 0
                : 0
            }
          />
        );
      });

    soccer = matches
      .filter((match) => match.sport === "1")
      .map((match) => {
        return (
          <EventRow
            key={match.marketId}
            marketId={match.marketId}
            marketStartTime={match.marketStartTime}
            name={match.matchName}
            matchId={match.matchId}
            sport={props.id}
            cupRate={match.cupRate}
            odds={match.odds && match.odds.length ? match.odds[0] : ""}
            inplay={true}
            noOfRunners={
              match.odds && match.odds.length
                ? match.odds[0].runners
                  ? match.odds[0].runners.length
                  : 0
                : 0
            }
          />
        );
      });

    tennis = matches
      .filter((match) => match.sport === "2")
      .map((match) => {
        return (
          <EventRow
            key={match.marketId}
            marketId={match.marketId}
            marketStartTime={match.marketStartTime}
            name={match.matchName}
            matchId={match.matchId}
            sport={props.id}
            cupRate={match.cupRate}
            odds={match.odds && match.odds.length ? match.odds[0] : ""}
            inplay={true}
            noOfRunners={
              match.odds && match.odds.length
                ? match.odds[0].runners
                  ? match.odds[0].runners.length
                  : 0
                : 0
            }
          />
        );
      });

    allMatches = (
      <>
        {cricket && !!cricket?.length && (
          <div className={classes.eventWrapper}>
            <h3 className={classes.eventTitle}>
              <span>Cricket</span>
            </h3>
            <TableContainer className={classes.root}>
              <Table>
                <TableHead>
                  <TableRow className={classes.head}>
                    <TableCell className={classes.match}></TableCell>
                    <TableCell className={classes.tableCell}>1</TableCell>
                    <TableCell className={classes.tableCell}>X</TableCell>
                    <TableCell
                      className={classes.tableCell}
                      style={{ borderRight: 0 }}
                    >
                      2
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.body}>{cricket}</TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {soccer && !!soccer?.length && (
          <div className={classes.eventWrapper}>
            <h3 className={classes.eventTitle}>
              <span>Soccer</span>
            </h3>
            <TableContainer className={classes.root}>
              <Table>
                <TableHead>
                  <TableRow className={classes.head}>
                    <TableCell className={classes.match}></TableCell>
                    <TableCell className={classes.tableCell}>1</TableCell>
                    <TableCell className={classes.tableCell}>X</TableCell>
                    <TableCell
                      className={classes.tableCell}
                      style={{ borderRight: 0 }}
                    >
                      2
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.body}>{soccer}</TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {tennis && !!tennis?.length && (
          <div className={classes.eventWrapper}>
            <h3 className={classes.eventTitle}>
              <span>Tennis</span>
            </h3>
            <TableContainer className={classes.root}>
              <Table>
                <TableHead>
                  <TableRow className={classes.head}>
                    <TableCell className={classes.match}></TableCell>
                    <TableCell className={classes.tableCell}>1</TableCell>
                    <TableCell className={classes.tableCell}>X</TableCell>
                    <TableCell
                      className={classes.tableCell}
                      style={{ borderRight: 0 }}
                    >
                      2
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.body}>{tennis}</TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </>
    );
  } else {
    allMatches = (
      <div className={classes.noInPlay}>No Inplay Matches found</div>
    );
  }

  return (
    <div className={classes.inplay}>
      {isLoading ? <BetSpinner /> : allMatches}
    </div>
  );
};

export default Inplay;
