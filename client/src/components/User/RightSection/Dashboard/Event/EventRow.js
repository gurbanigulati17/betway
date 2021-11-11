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
    },
    match: {
      width: "50%",
      padding: "8px 10px",
      fontSize: 14,
      cursor: "pointer",
      fontFamily: appTheme.font.family,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        border: "none",
      },
    },
    tableCell: {
      width: "16.66%",
      padding: "8px 10px",
      fontSize: 14,
      cursor: "pointer",
      fontFamily: appTheme.font.family,
      [theme.breakpoints.down("sm")]: {
        width: "33.33%",
      },
    },
    Mname: {
      fontWeight: 700,
      lineHeight: 1.5,
      "& svg": {
        fontSize: 12,
        marginRight: 8,
      },
    },
    startTime: {
      fontSize: 11,
      marginLeft: 5,
      lineHeight: 1,
    },
    attribute: {
      display: "inline-block",
      padding: "3px 5px",
      fontSize: "75%",
      fontWeight: 700,
      lineHeight: 1,
      color: "#fff",
      textAlign: "center",
      whiteSpace: "nowrap",
      verticalAlign: "baseline",
      borderRadius: "0.25em",
      backgroundColor: "#0089ff",
      marginLeft: 10,
    },
    cell: {
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      "& > div": {
        color: "#000",
        cursor: "pointer",
        minHeight: 32,
        lineHeight: "32px",
        width: "50%",
        border: "1px solid #fff",
      },
    },
    blue: {
      backgroundColor: "#8dd2f0",
    },
    pink: {
      backgroundColor: "#feafb2",
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
          <i class="fa fa-asterisk"></i>
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
            - {eventDate.toLocaleString("en-IN")}
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
            <i class="fa fa-asterisk"></i>
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
              - {eventDate.toLocaleString("en-IN")}
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
