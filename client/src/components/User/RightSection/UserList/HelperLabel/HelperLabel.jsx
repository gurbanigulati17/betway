import React from "react";
import classes from "./HelperLabel.module.css";
export default function HelperLabel() {
  return (
    <ul className={classes.HelperLabel}>
      <li>
        <strong>A: </strong> Add User
      </li>
      <li>
        <strong>Se: </strong>Close settlement
      </li>
      <li>
        <strong>S: </strong>Statement
      </li>
      <li>
        <strong>PL: </strong>Profit Loss
      </li>
      <li>
        <strong>I: </strong>View Info
      </li>
      <li>
        <strong>P: </strong>Change Password
      </li>
      <li>
        <strong>D-W: </strong>Free Chip In Out
      </li>
      <li>
        <strong>C: </strong>Change Fullname
      </li>
      <li>
        <strong>L: </strong>Login Activity
      </li>
    </ul>
  );
}
