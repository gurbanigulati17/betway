import React from "react";
import { TableRow, TableCell } from "@material-ui/core";

const BetRow = (props) => {
  return (
    <TableRow
      style={{
        backgroundColor: props.selection === "back" ? "#b0d8f5" : "#f9c2ce",
      }}
    >
      <TableCell>{props.betId}</TableCell>
      {props.username ? <TableCell>{props.username}</TableCell> : null}
      <TableCell style={{ minWidth: "230px" }}>
        {props.runner}
        {props.type === "fancy" ? "/" + props.user_rate : "/" + props.market}
      </TableCell>
      <TableCell>{props.odds}</TableCell>
      <TableCell>{props.stake}</TableCell>
      {props.seniorsuper ? <TableCell>{props.seniorsuper}</TableCell> : null}
      {props.supermaster ? <TableCell>{props.supermaster}</TableCell> : null}
      {props.master ? <TableCell>{props.master}</TableCell> : null}
      <TableCell>{props.IP_Address}</TableCell>
      <TableCell style={{ minWidth: "280px" }}>{props.placed_at}</TableCell>
    </TableRow>
  );
};

export default BetRow;
