import React from "react";
import loader from "../../../assets/images/loader.svg";
import { ReactComponent as LoaderSmall } from "../../../assets/images/loader-sm.svg";
import classes from "./BetSpinner.module.css";

export default function BetSpinner(props) {
  return props.size === "sm" ? (
    <span {...props} className={classes.loaderSm}>
      <LoaderSmall width={props.width || 16} height={props.height || 16} />
    </span>
  ) : (
    <div {...props} className={classes.loader}>
      <img
        src={loader}
        width={props.width || 100}
        height={props.height || 100}
        alt="Loading..."
      />
    </div>
  );
}
