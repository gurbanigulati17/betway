import React, { useEffect, useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
  TableContainer,
  Switch,
} from "@material-ui/core";
import axios from "../../../../axios-instance/backendAPI";
import alertify from "alertifyjs";
import { makeStyles } from "@material-ui/core/styles";
import "alertifyjs/build/css/alertify.css";
import { Link } from "react-router-dom";

import { sectionStyle } from "../../../../utils/common.style";

export default function BlockMarket() {
  const classes = useStyles();
  const [sports, setSports] = useState([]);
  const [flag, setFlag] = useState(false);

  const handleChange = (event_type) => {
    axios
      .get("/user/toggleSport/" + event_type, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          alertify.success(response.data.message);
          setFlag((prevState) => {
            return !prevState;
          });
        } else {
          alertify.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get("/user/sportList", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setSports(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [flag]);

  let sportRow = null;

  if (sports.length) {
    sportRow = sports.map((sport) => {
      return (
        <TableRow key={sport.event_type}>
          <TableCell className={`${classes.cell} ${classes.colSmall}`}>
            {sport.event_type}
          </TableCell>
          <TableCell className={classes.cell}>
            <Link
              to={`/blockMarket/${sport.event_type}`}
              className={classes.linkText}
            >
              {sport.name}
            </Link>
          </TableCell>
          <TableCell className={`${classes.cell} ${classes.colMid}`}>
            <Switch
              checked={sport.status === "on" ? true : false}
              onChange={() => {
                handleChange(sport.event_type);
              }}
              color="primary"
              name="checkedB"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </TableCell>
        </TableRow>
      );
    });
  } else {
    sportRow = (
      <TableRow>
        <TableCell>No data</TableCell>
      </TableRow>
    );
  }

  return (
    <Paper className={classes.paper}>
      <div className={classes.titlePanel}>
        <span className={classes.title}>Block Market</span>
      </div>
      <TableContainer className={classes.container}>
        <Table aria-label="simple table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={`${classes.head} ${classes.colId}`}>
                Id
              </TableCell>
              <TableCell className={`${classes.head} ${classes.colName}`}>
                Name
              </TableCell>
              <TableCell className={`${classes.head} ${classes.action}`}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{sportRow}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const useStyles = makeStyles(sectionStyle);
