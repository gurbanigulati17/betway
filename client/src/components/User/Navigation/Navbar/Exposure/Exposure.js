import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import axios from "../../../../../axios-instance/backendAPI";
import React, { useState, useEffect } from "react";

export default function Exposure() {
  const [exposure, setExposure] = useState(null);

  useEffect(() => {
    axios
      .get("/user/getExposure", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setExposure(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let allExposures = null;

  if (exposure && exposure.length) {
    allExposures = exposure.map((marketRow) => {
      return (
        <TableRow key={marketRow.market + marketRow.event}>
          <TableCell>{marketRow.event}</TableCell>
          <TableCell>{marketRow.market}</TableCell>
          <TableCell>{marketRow.exposure}</TableCell>
          <TableCell>{marketRow.sport}</TableCell>
        </TableRow>
      );
    });
  }

  return (
    <TableContainer component={Paper} style={{ maxHeight: "400px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ minWidth: "250px" }}>Event</TableCell>
            <TableCell style={{ minWidth: "250px" }}>Market</TableCell>
            <TableCell>Exposure</TableCell>
            <TableCell>Sport</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{allExposures}</TableBody>
      </Table>
    </TableContainer>
  );
}
