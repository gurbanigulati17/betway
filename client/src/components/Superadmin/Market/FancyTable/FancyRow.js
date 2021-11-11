import React, { useEffect, useState } from "react";
import classes from "./FancyTable.module.css";
import axios from "../../../../axios-instance/backendAPI";
import Button from "@material-ui/core/Button";

const bl = "Ball";
const sus = "SUSPENDED";

const FancyRow = (props) => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    getStatus();
  }, []);

  const getStatus = () => {
    axios
      .get("/superadmin/isBlocked/" + props.eventId + "/" + props.id, {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        if (response.data.success) {
          setStatus(!response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const toggleStatus = () => {
    const payload = {
      eventId: props.eventId,
      sessionId: props.id,
    };

    axios
      .put("/superadmin/toggleFancyStatus", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        if (response.data.success) {
          getStatus();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let value = (
    <>
      <div className={[classes.lay].join(" ")}>
        <div> {props.layPrice1}</div>
        <div className={classes.tiny}> {props.laySize1}</div>
      </div>
      <div className={[classes.back].join(" ")}>
        <div> {props.backPrice1}</div>
        <div className={classes.tiny}> {props.backSize1} </div>
      </div>
      <div className={classes.mobile}>{props.min + "/" + props.max}</div>
    </>
  );

  if (props.layPrice1 === bl) {
    value = (
      <>
        <div
          style={{ backgroundColor: "#f2f2f2", color: "red", textAlign: "end" }}
        >
          BALL RU
        </div>
        <div
          style={{
            backgroundColor: "#f2f2f2",
            color: "red",
            textAlign: "start",
          }}
        >
          NNING
        </div>
      </>
    );
  }
  if (props.GameStatus === sus) {
    value = (
      <>
        <div
          style={{
            backgroundColor: "#f2f2f2",
            color: "#b21318",
            textAlign: "end",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            fontWeight: "bold",
          }}
        >
          SUSPE
        </div>
        <div
          style={{
            backgroundColor: "#f2f2f2",
            color: "#b21318",
            textAlign: "start",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            fontWeight: "bold",
          }}
        >
          NDED
        </div>
      </>
    );
  }

  return (
    <>
      <div className={classes.midGrid}>
        <div className={classes.fancyName}>
          <div className={classes.textLeft}> {props.name} </div>
          <Button
            onClick={toggleStatus}
            color={status ? "secondary" : "primary"}
            variant="contained"
          >
            {status ? "D" : "A"}
          </Button>
        </div>
        <div className={classes.odds}>{value}</div>
      </div>
      <div
        className={[props.isActive ? classes.dblock : classes.dNone].join(" ")}
      >
        {value}
      </div>
    </>
  );
};

export default FancyRow;
