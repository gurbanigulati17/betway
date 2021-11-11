import React from "react";
import classes from "./RepostList.module.css";
export default function ReportList(props) {
  return (
    <nav>
      <div className={classes.subMenuParent} tab-index="0">
        <span className={classes.span}>{props.report}</span>
        <ul className={classes.subMenu}>
          {props.reportlist.map((report) => {
            return (
              <li
                key={report.name}
                onClick={report.onCall}
                className={classes.li}
              >
                {report.name}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
