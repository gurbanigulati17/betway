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
import axios from "../../../../axios-instance/backendAPI";
import format from "date-fns/format";
import { makeStyles } from "@material-ui/core/styles";
import "alertifyjs/build/css/alertify.css";

import { sectionStyle } from "../../../../utils/common.style";

export default function BlockMarket() {
  const classes = useStyles();
  const [markets, setMarkets] = useState([]);
  const [fancyMarket, setFancyMarket] = useState(null);
  const { eventType } = useParams();

  const handleMarketChange = (id) => {
    const payload = {
      id: id,
      eventId: eventType,
    };
    axios
      .put("/superadmin/toggleMarket", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        getMarkets(eventType);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFancyChange = () => {
    const payload = {
      id: eventType,
    };
    axios
      .put("/superadmin/toggleFancyMarket", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        getFancyMarket(eventType);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMarkets = (id) => {
    if (id) {
      axios
        .get("/superadmin/getMarketsByMatch/" + id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          response.data.data.forEach((market) => {
            if (market.status === "on") {
              market.status = true;
            } else {
              market.status = false;
            }
          });
          setMarkets(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getFancyMarket = (id) => {
    axios
      .get("/superadmin/getFancyMarket/" + id, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.result.length) {
          if (response.data.result[0].status === "on") {
            response.data.result[0].status = true;
          } else {
            response.data.result[0].status = false;
          }
          setFancyMarket(response.data.result[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getMarkets(eventType);
    getFancyMarket(eventType);
  }, []);

  return (
    <Paper className={classes.paper}>
      <div className={classes.titlePanel}>
        <span className={classes.title}>Block Market</span>
      </div>
      <TableContainer className={classes.container}>
        <Table aria-label="simple table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={`${classes.head} ${classes.colSmall}`}>
                Id
              </TableCell>
              {markets.length && (
                <TableCell className={classes.head}>Date</TableCell>
              )}
              {markets.map((item) => (
                <TableCell className={`${classes.head} ${classes.colSmall}`}>
                  {item.name} ON/OFF
                </TableCell>
              ))}
              {fancyMarket && (
                <TableCell className={`${classes.head} ${classes.colSmall}`}>
                  Fancy ON/OFF
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.cell}>{eventType}</TableCell>
              {markets.length && (
                <TableCell className={classes.cell}>
                  {format(
                    new Date(markets[0].marketStartTime),
                    "dd/MM/yyyy hh:mm a"
                  )}
                </TableCell>
              )}

              {markets.map((item) => (
                <TableCell className={`${classes.cell} ${classes.colSmall}`}>
                  <Switch
                    checked={item.status}
                    onChange={() => {
                      handleMarketChange(item.id);
                    }}
                    color="primary"
                    name="checkedB"
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </TableCell>
              ))}

              {fancyMarket && (
                <TableCell className={`${classes.cell} ${classes.colSmall}`}>
                  <Switch
                    checked={fancyMarket.status}
                    onChange={() => {
                      handleFancyChange();
                    }}
                    color="primary"
                    name="checkedB"
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const useStyles = makeStyles(sectionStyle);
