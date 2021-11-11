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

import appTheme from "../../../../styles/theme";

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
              className={classes.link}
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    backgroundColor: "#f5f5f5",
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      margin: -10,
      width: "initial",
      padding: 20,
    },
  },
  container: {
    overflow: "auto",
    maxHeight: 440,
  },
  table: {
    overflow: "scroll",
    border: "solid 1px #bdc3c7",
    backgroundColor: "#FFFFFF",
    "& thead th": {
      padding: "6px 12px",
      color: "rgba(0,0,0,.54)",
      font: '600 12px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      backgroundColor: "#f5f7f7",
      position: "relative",
    },
    "& thead th::before": {
      borderRight: "1px solid rgba(189,195,199,.5)",
      content: "''",
      height: 16,
      marginTop: 8,
      position: "absolute",
      left: 0,
      textIndent: 2000,
      top: 0,
    },
    "& thead th:first-child::before": {
      content: "none",
    },
    "& tbody td": {
      font: '400 12px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      padding: "0 12px",
      color: "rgba(0,0,0)",
      lineHeight: "32px",
      borderBottom: "solid 1px #d9dcde",
    },
    "& tbody td p": {
      margin: 0,
    },
    "& tbody td button": {
      marginTop: "5px !important",
      marginBottom: "5px !important",
    },
  },
  titlePanel: {
    background: appTheme.colors.primary,
    color: appTheme.colors.textLight,
    fontWeight: 700,
    border: 0,
    margin: "-10px -10px 10px -10px",
    minHeight: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  title: {
    marginRight: "10px",
    fontSize: 14,
    fontFamily: "inherit",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  currentPosition: {
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "space-evenly",
  },
  link: {
    color: "#43b1bd",
  },
  action: {
    width: 150,
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  colId: {
    width: 100,
    [theme.breakpoints.down("sm")]: {
      width: 55,
    },
  },
  colName: {
    minWidth: 200,
  },
}));
