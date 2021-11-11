import React from "react";
import Event from "./Event/Event";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    paddingBottom: 40,
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 20,
    },
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.dashboard}>
      <Event id="4" />
      <Event id="1" />
      <Event id="2" />
    </div>
  );
}
