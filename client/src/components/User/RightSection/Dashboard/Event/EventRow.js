import React from "react";
import { useHistory } from "react-router-dom";
import { TableRow, TableCell } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import appTheme from "../../../../../styles/theme";

const EventRow = (props) => {
  const useStyles = makeStyles((theme) => ({
    row: {
      display: "flex",
      flexWrap: "wrap",
      "&:hover": {
        backgroundColor: "rgba(0,0,0,.075)",
      },
    },
    match: {
      width: "70%",
      padding: 3,
      fontSize: 12,
      cursor: "pointer",
      fontFamily: appTheme.font.family,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        border: "none",
        padding: "8px 10px",
        fontSize: 16,
        borderBottom: "1px solid rgba(224, 224, 224, 1)",
      },
    },
    tableCell: {
      width: "10%",
      padding: 3,
      fontSize: 12,
      cursor: "pointer",
      fontFamily: appTheme.font.family,
      [theme.breakpoints.down("sm")]: {
        width: "33.33%",
        display: "none",
      },
    },
    Mname: {
      fontWeight: 700,
      lineHeight: 1.5,
      color: "#2789ce",
      marginRight: 10,
    },
    startTime: {
      color: "#777",
      fontSize: 12,
      lineHeight: 1,
    },
    attribute: {
      fontWeight: 700,
      color: "#508d0e",
      [theme.breakpoints.down("sm")]: {
        fontSize: 12,
      },
    },
    cell: {
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      "& > div": {
        color: "#000",
        cursor: "pointer",
        minHeight: 20,
        lineHeight: "20px",
        width: "50%",
        border: 0,
        fontWeight: 700,
      },
    },
    blue: {
      backgroundColor: "#72bbef",
    },
    pink: {
      backgroundColor: "#faa9ba",
    },
    mobileMarker: {
      display: "none",
    },
  }));

  const classes = useStyles();
  const history = useHistory();

  function redirectToMarket() {
    history.push("/fullmarket/" + props.matchId);
  }

  const eventDate = new Date(props.marketStartTime);
  let marketOdds = (
    <TableRow className={classes.row} onClick={redirectToMarket}>
      <TableCell className={classes.match}>
        <div className={classes.Mname}>
          <span>{props.name}</span>
        </div>
        {props.matchId === props.cupRate ? (
          <div className={classes.attribute}>
            <i className="fas fa-trophy" />
            <span style={{ marginLeft: 5 }}>Cup Rate</span>
          </div>
        ) : props.inplay ? (
          <div className={classes.attribute}>In-Play</div>
        ) : (
          <div className={classes.startTime}>
            {eventDate.toLocaleString("en-IN")}
          </div>
        )}
      </TableCell>
      <TableCell className={classes.tableCell}>
        <div className={classes.mobileMarker}>1</div>
        <div className={classes.cell}>
          <div className={classes.blue}>-</div>
          <div className={classes.pink}>-</div>
        </div>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <div className={classes.mobileMarker}>X</div>
        <div className={classes.cell}>
          <div className={classes.blue}>-</div>
          <div className={classes.pink}>-</div>
        </div>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <div className={classes.mobileMarker}>2</div>
        <div className={classes.cell}>
          <div className={classes.blue}>-</div>
          <div className={classes.pink}>-</div>
        </div>
      </TableCell>
    </TableRow>
  );
  if (props.odds) {
    marketOdds = (
      <TableRow className={classes.row} onClick={redirectToMarket}>
        <TableCell className={classes.match}>
          <div className={classes.Mname}>
            <span>{props.name}</span>
          </div>
          {props.matchId === props.cupRate ? (
            <div className={classes.attribute}>
              <i className="fas fa-trophy" />
              <span style={{ marginLeft: 5 }}>Cup Rate</span>
            </div>
          ) : props.inplay ? (
            <div className={classes.attribute}>In-Play</div>
          ) : (
            <div className={classes.startTime}>
              {eventDate.toLocaleString("en-IN")}
            </div>
          )}
        </TableCell>
        <TableCell className={classes.tableCell}>
          <div className={classes.mobileMarker}>1</div>
          <div className={classes.cell}>
            <div className={classes.blue}>
              {props.odds.runners &&
              props.odds.runners.length &&
              props.odds.runners[0].ex.availableToBack &&
              props.odds.runners[0].ex.availableToBack.length &&
              props.odds.runners[0].ex.availableToBack[0].price
                ? props.odds.runners[0].ex.availableToBack[0].price
                : "-"}
            </div>
            <div className={classes.pink}>
              {props.odds.runners &&
              props.odds.runners.length &&
              props.odds.runners[0].ex.availableToLay &&
              props.odds.runners[0].ex.availableToLay.length &&
              props.odds.runners[0].ex.availableToLay[0].price
                ? props.odds.runners[0].ex.availableToLay[0].price
                : "-"}
            </div>
          </div>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <div className={classes.mobileMarker}>X</div>
          <div className={classes.cell}>
            <div className={classes.blue}>
              {props.noOfRunners === 2
                ? "-"
                : props.odds.runners &&
                  props.odds.runners.length &&
                  props.odds.runners[2].ex.availableToBack &&
                  props.odds.runners[2].ex.availableToBack.length &&
                  props.odds.runners[2].ex.availableToBack[0].price
                ? props.odds.runners[2].ex.availableToBack[0].price
                : "-"}
            </div>
            <div className={classes.pink}>
              {props.noOfRunners === 2
                ? "-"
                : props.odds.runners &&
                  props.odds.runners.length &&
                  props.odds.runners[2].ex.availableToLay &&
                  props.odds.runners[2].ex.availableToLay.length &&
                  props.odds.runners[2].ex.availableToLay[0].price
                ? props.odds.runners[2].ex.availableToLay[0].price
                : "-"}
            </div>
          </div>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <div className={classes.mobileMarker}>2</div>
          <div className={classes.cell}>
            <div className={classes.blue}>
              {props.odds.runners &&
              props.odds.runners.length &&
              props.odds.runners[1].ex.availableToBack &&
              props.odds.runners[1].ex.availableToBack.length &&
              props.odds.runners[1].ex.availableToBack[0].price
                ? props.odds.runners[1].ex.availableToBack[0].price
                : "-"}
            </div>
            <div className={classes.pink}>
              {props.odds.runners &&
              props.odds.runners.length &&
              props.odds.runners[1].ex.availableToLay &&
              props.odds.runners[1].ex.availableToLay.length &&
              props.odds.runners[1].ex.availableToLay[0].price
                ? props.odds.runners[1].ex.availableToLay[0].price
                : "-"}
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return <>{marketOdds}</>;
};
export default EventRow;
