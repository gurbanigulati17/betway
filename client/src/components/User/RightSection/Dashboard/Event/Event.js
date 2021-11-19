import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableContainer,
} from "@material-ui/core";
import axios from "../../../../../axios-instance/backendAPI";
import odds_axios from "../../../../../axios-instance/oddsApi";
import EventRow from "./EventRow";
import { makeStyles } from "@material-ui/core/styles";
import BetSpinner from "../../../../UI/Spinner/BetSpinner";
import { useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import appTheme from "../../../../../styles/theme";

const useStyles = makeStyles((theme) => ({
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
    [theme.breakpoints.down("sm")]: {
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
    [theme.breakpoints.down("sm")]: {
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
      display: "none",
    },
    lineHeight: 1,
  },
  eventTitle: {
    background: appTheme.colors.primary,
    color: appTheme.colors.textLight,
    textTransform: "uppercase",
    fontWeight: 700,
    border: 0,
    margin: 0,
    cursor: "pointer",
    fontSize: 12,
    padding: "1rem",
  },
}));

const Event = (props) => {
  let sports = [
    { id: "4", name: "cricket", title: "Cricket" },
    { id: "1", name: "soccer", title: "Soccer" },
    { id: "2", name: "tennis", title: "Tennis" },
  ];
  sports = sports.filter((sport) => sport.id === props.id);
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);
  const [marketIds, setMarketIds] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const dispatch = useDispatch();
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

            setMatches(allMatches);
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
      .get("/user/getMatchesBySport/" + props.id, {
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

            setMarketIds(marketIds);
            setMatches(response.data.data);
          }
        }
        dispatch(actions.resetMessage());
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
        //setIntervalId(setInterval(getOdds, 1000))
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

  if (matches && matches.length) {
    allMatches = matches
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
            odds={match.odds ? match.odds[0] : {}}
            isHighlighted={(index + 1) % 2 === 0}
            inplay={
              match.odds && match.odds.length ? match.odds[0].inplay : false
            }
            noOfRunners={
              match.odds && match.odds.length
                ? match.odds[0].runners
                  ? match.odds[0].runners.length
                  : 0
                : 0
            }
          />
        );
      })
      .filter((match) => match !== null);

    if (!allMatches.length) {
      allMatches = <BetSpinner />;
    }
  } else {
    allMatches = (
      <TableRow>
        <TableCell align="center" colSpan="4">
          😢 No {sports[0].name} Matches
        </TableCell>
      </TableRow>
    );
  }

  return isLoading ? (
    <BetSpinner />
  ) : (
    <div className={classes.eventWrapper}>
      {props.isTitle && (
        <h3 className={classes.eventTitle}>
          <i class="fa fa-trophy"></i>
          <span style={{ marginLeft: 10 }}>{sports[0].title}</span>
        </h3>
      )}
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
          <TableBody className={classes.body}>{allMatches}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Event;
