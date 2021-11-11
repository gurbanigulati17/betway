import React, { useState, useEffect, useRef } from "react";
import classes from "./FancyTable.module.css";
import axios from "../../../../axios-instance/oddsApi";
import back_axios from "../../../../axios-instance/backendAPI";
import FancyRow from "./FancyRow";

const Fancy = (props) => {
  const [sessions, setSessions] = useState(null);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const ref = useRef();

  useEffect(() => {
    getMaxMin();
    getOdds();
    ref.current = setInterval(getOdds, 4000);
  }, [props.matchId]);

  useEffect(() => {
    return () => {
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    };
  }, [props.matchId]);

  const getOdds = () => {
    axios
      .get("/getSession/" + props.matchId)
      .then((response) => {
        if (response.data.data.length && response.data.data[0] !== "\n") {
          response.data.data.sort((a, b) => a.SelectionId - b.SelectionId);

          setSessions(response.data.data);
        } else if (!response.data.data.length) {
          setSessions(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMaxMin = () => {
    back_axios
      .get("/superadmin/getFancyMaxMin/" + props.matchId, {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        if (response.data.data.length) {
          setMax(response.data.data[0].max);
          setMin(response.data.data[0].min);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let fancyHead = null,
    fancyRow = null;
  if (sessions) {
    fancyHead = (
      <>
        <div className={classes.headGrid}>
          <div className={classes.tableName}>Fancy Bet</div>
          <div className={classes.tiny}>
            {" "}
            Min/Max :- <span>{min + "/" + max}</span>
          </div>
        </div>

        <div className={classes.upperGrid}>
          <div></div>
          <div className={classes.odds}>
            <div className={[classes.textCenter, classes.no].join(" ")}>No</div>
            <div className={[classes.textCenter, classes.yes].join(" ")}>
              Yes
            </div>
            <div
              className={[classes.textCenter, classes.mobile].join(" ")}
            ></div>
          </div>
        </div>
      </>
    );

    fancyRow = sessions.map((session) => {
      return (
        <FancyRow
          key={session.SelectionId}
          id={session.SelectionId}
          name={session.RunnerName}
          layPrice1={session.LayPrice1}
          laySize1={session.LaySize1}
          backPrice1={session.BackPrice1}
          backSize1={session.BackSize1}
          isActive={session.SelectionId === props.activeId}
          showModal={props.showModal}
          GameStatus={session.GameStatus}
          max={max}
          min={min}
          eventId={props.matchId}
          sport={props.sport}
          eventName={props.eventName}
        />
      );
    });
  }

  return (
    <div className={classes.Fancy}>
      {fancyHead}
      {fancyRow}
    </div>
  );
};

export default Fancy;
