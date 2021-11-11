import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import format from "date-fns/format";
import axios from "../../../../axios-instance/backendAPI";
import { makeStyles } from "@material-ui/core/styles";
import "alertifyjs/build/css/alertify.css";
import { Link } from "react-router-dom";

import appTheme from "../../../../styles/theme";

export default function BlockMarket() {
  const classes = useStyles();
  const [matches, setMatches] = useState([]);
  const [sportTitle, setTitle] = useState("");
  const [flag, setFlag] = useState(false);

  const { eventType } = useParams();

  function handleSwitchChange(id) {
    const payload = {
      id: id,
    };
    axios
      .put("/superadmin/toggleMatch", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        getMatches(eventType);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getSports() {
    axios
      .get("/user/sportList", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setTitle(
            response.data.data.filter(
              (item) => String(item.event_type) === eventType
            )[0].name
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getMatches(id) {
    if (id) {
      axios
        .get("/superadmin/getMatches/" + id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          const result = response?.data?.result || [];
          result.forEach((match) => {
            if (match.status === "on") {
              match.status = true;
            } else {
              match.status = false;
            }
          });
          setMatches(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  useEffect(() => {
    getSports();
  }, []);

  useEffect(() => {
    getMatches(eventType);
  }, []);

  let matchesRow = null;

  if (matches.length) {
    matchesRow = matches.map((sport) => {
      return (
        <TableRow key={sport.id}>
          <TableCell className={classes.cell}>{sport.id}</TableCell>
          <TableCell className={`${classes.cell} ${classes.colMinWidth}`}>
            <Link
              to={`/blockMarket/${sport.id}/setting`}
              className={classes.link}
            >
              {sport.name}
            </Link>
          </TableCell>
          <TableCell className={`${classes.cell} ${classes.colSmall}`}>
            {format(new Date(sport.openDate), "dd/MM/yyyy hh:mm a")}
          </TableCell>
          <TableCell className={`${classes.cell} ${classes.colSmall}`}>
            <Switch
              checked={sport.status}
              onChange={() => {
                handleSwitchChange(sport.id);
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
    matchesRow = (
      <TableRow>
        <TableCell>No data</TableCell>
      </TableRow>
    );
  }

  return (
    <Paper className={classes.paper}>
      <div className={classes.titlePanel}>
        <span className={classes.title}>Block Market - {sportTitle}</span>
      </div>
      <TableContainer className={classes.container}>
        <Table aria-label="simple table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={`${classes.head} ${classes.colId}`}>
                Id
              </TableCell>
              <TableCell className={`${classes.head} ${classes.colMinWidth}`}>
                Match Name
              </TableCell>
              <TableCell className={`${classes.head} ${classes.colSmall}`}>
                Open Date
              </TableCell>
              <TableCell className={`${classes.head} ${classes.colSmall}`}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{matchesRow}</TableBody>
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
  colId: {
    width: 130,
    [theme.breakpoints.down("sm")]: {
      width: 100,
    },
  },
  colSmall: {
    width: 190,
  },
  colMinWidth: {
    minWidth: 225,
  },
}));
