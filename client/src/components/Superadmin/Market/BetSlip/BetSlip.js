import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export default function BetSlip() {
  const useStyles = makeStyles((theme) => ({
    head: {
      backgroundColor: "#452d88",
      height: "30px",
      color: "white",
      textAlign: "center",
    },
    root: {
      margin: "0 10px",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.head}>Bet Slip</div>
    </div>
  );
}
