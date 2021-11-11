import React from "react";
import classes from "./Table.module.css";
export default function Table(props) {
  const array1 = [],
    array2 = [];

  for (let i = 1, j = 7; i <= 6, j <= 12; i++, j++) {
    array1.push({ value: i, label: i.toString() });
    if (j === 10) {
      array2.push({ value: 10, label: "0" });
    } else if (j === 11) {
      array2.push({ value: 100, label: "00" });
    } else if (j === 12) {
      array2.push({ value: 1000, label: "000" });
    } else {
      array2.push({ value: j, label: j.toString() });
    }
  }

  return (
    <table className={classes.display}>
      <tbody>
        <tr>
          {array1.map((num) => {
            return (
              <td
                key={num.value}
                className={[classes.borderdata, classes.topRowData].join(" ")}
                onClick={() => {
                  props.setStakeTable(num.value);
                }}
              >
                {num.label}
              </td>
            );
          })}
          <td
            rowSpan="2"
            className={[classes.borderdata, classes.topRowData].join(" ")}
            onClick={() => {
              props.backspace();
            }}
          >
            <i className="fas fa-backspace fa-1x"></i>
          </td>
        </tr>
        <tr>
          {array2.map((num) => {
            return (
              <td
                key={num.value}
                className={classes.borderdata}
                onClick={() => {
                  props.setStakeTable(num.value);
                }}
              >
                {num.label}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
}
