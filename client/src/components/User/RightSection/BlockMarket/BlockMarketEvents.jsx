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

import { sectionStyle } from "../../../../utils/common.style";

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
          <TableCell className={classes.cell} style={{ minWidth: 100 }}>
            {sport.id}
          </TableCell>
          <TableCell
            className={`${classes.cell} ${classes.colMinWidth}`}
            style={{ minWidth: 150 }}
          >
            <Link
              to={`/blockMarket/${sport.id}/setting`}
              className={classes.linkText}
            >
              {sport.name}
            </Link>
          </TableCell>
          <TableCell
            className={`${classes.cell} ${classes.colSmall}`}
            style={{ minWidth: 150 }}
          >
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

const useStyles = makeStyles(sectionStyle);
