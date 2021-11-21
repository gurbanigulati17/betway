import React from "react";
import classes from "./BetSpinner.module.css";

export default function BetSpinner(props) {
  return (
    <div className={classes.loaderWrapper}>
      <div class={classes.loader}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={classes.text}>Loading...</div>
    </div>
  );
}
