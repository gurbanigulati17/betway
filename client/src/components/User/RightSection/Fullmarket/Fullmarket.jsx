import React, { useState } from "react";
import Market from "./Market/Market";
import BetSlip from "./BetSlip/BetSlip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "60% 40%",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  marketCol: {
    paddingBottom: 40,
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 0,
    },
  },
}));

export default function Fullmarket() {
  const [event, setEvent] = useState({
    eventId: "",
    marketId: "",
  });
  const [flag, setFlag] = useState(false);
  const [stakeChanged, setStakeChanged] = useState(false);
  const classes = useStyles();

  const changeFlag = () => {
    setFlag((prevValue) => {
      return !prevValue;
    });
  };

  const changeStakeChanged = () => {
    setStakeChanged((prevValue) => {
      return !prevValue;
    });
  };

  const changeMarket = (marketId, eventId) => {
    setEvent({
      eventId: eventId,
      marketId: marketId,
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.marketCol}>
        <Market
          changeMarket={changeMarket}
          changeFlag={changeFlag}
          stakeChanged={stakeChanged}
        />
      </div>
      <div className={classes.betSlipCol}>
        <BetSlip
          display="block"
          marketId={event.marketId}
          eventId={event.eventId}
          flag={flag}
          changeStakeChanged={changeStakeChanged}
        />
      </div>
    </div>
  );
}
