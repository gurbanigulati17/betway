import React, { useState, useEffect, useRef } from "react";
import classes from "./FancyTable.module.css";
import axios from "../../../../../../axios-instance/oddsApi";
import back_axios from "../../../../../../axios-instance/backendAPI";
import FancyRow from "./FancyRow";
import { useSelector } from "react-redux";
import Rules from "../../../../../UI/Rules";

const Fancy = (props) => {
  const [sessions, setSessions] = useState(null);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [status, setStatus] = useState("on");
  const usertype = useSelector((state) => state.auth.usertype);
  const ref = useRef();
  const fancywsc = useRef(null);
  const [isRulesVisible, setRules] = useState(false);

  const toggleRules = () => setRules((prev) => !prev);

  useEffect(() => {
    getMaxMin();
    //getOdds()
    // if (usertype !== '5') {
    //     ref.current = setInterval(getOdds, 6000)
    // } else {
    //     ref.current = setInterval(getOdds, 1500)
    // }
  }, [props.matchId]);

  useEffect(() => {
    return () => {
      if (fancywsc.current && fancywsc.current.close) {
        fancywsc.current.close();
      }
    };
  }, []);

  useEffect(() => {
    getOdds();
  }, [status]);

  useEffect(() => {
    return () => {
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    };
  }, [props.matchId]);

  const getOdds = () => {
    const ignoreOddsWith = [".1", ".2", ".3", ".4", ".5", ".6"];
    const BASE_URL = "ws://65.0.166.92:4600";
    fancywsc.current = new WebSocket(
      `${BASE_URL}/getSession/event/` + props.matchId
    );
    fancywsc.current.onerror = (e) => {
      console.log("Something Went Wrong!");
    };
    //let wsccounter = 0;
    fancywsc.current.onmessage = (e) => {
      let response = JSON.parse(e.data);
      if (
        response?.data?.length &&
        response?.data[0] !== "\n" &&
        status === "on"
      ) {
        const data = response.data;
        const fancydata = data
          .filter((item) => {
            if (item && item.RunnerName) {
              const isDecimalExist = ignoreOddsWith.some((text) =>
                item.RunnerName.includes(text)
              );
              return !isDecimalExist;
            }
            return false;
          })
          .sort((a, b) => a?.SelectionId - b?.SelectionId);

        setSessions(fancydata);
      } else if (!response.data.length) {
        setSessions(null);
      } else if (status === "off") {
        setSessions(null);
        //clearInterval(ref.current);
      }
      if (!response.data.length) {
        setTimeout(() => {
          fancywsc.current.close();
        }, 10000);
      }
    };

    // axios.get('/getSession/' + props.matchId)
    //     .then(response => {
    //         if (response.data.data.length && response.data.data[0] !== "\n" && status === 'on') {

    //             response.data.data.sort((a, b) => a.SelectionId - b.SelectionId)

    //             setSessions(response.data.data);
    //         }
    //         else if (!response.data.data.length) {
    //             setSessions(null);
    //         }
    //         else if (status === 'off') {
    //             setSessions(null);
    //             clearInterval(ref.current);
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })
  };
  const getMaxMin = () => {
    back_axios
      .get("/user/getFancyMaxMin/" + props.matchId, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.data.length) {
          setMax(response.data.data[0].max);
          setMin(response.data.data[0].min);
          setStatus(response.data.data[0].status);
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
        <div className={classes.title}>
          <div className={classes.box}>
            <span style={{ marginRight: 8 }}>Fancy Bet</span>
            <span onClick={toggleRules} className={classes.infoWrapper}>
              <i className={`${classes.info} fa fa-info-circle`}></i>
            </span>
          </div>
        </div>
        <div className={classes.head}>
          <div className={[classes.headTitle, classes.titleBack].join(" ")}>
            No
          </div>
          <div className={[classes.headTitle, classes.titleLay].join(" ")}>
            Yes
          </div>
          <div className={[classes.maxMinTitle].join(" ")}>Min/Max</div>
        </div>
      </>
    );

    fancyRow = sessions.map((session) => {
      return (
        session && (
          <FancyRow
            key={session.SelectionId}
            id={session.SelectionId}
            name={session.RunnerName}
            layPrice1={session.LayPrice1}
            laySize1={session.LaySize1}
            backPrice1={session.BackPrice1}
            backSize1={session.BackSize1}
            isActive={session.SelectionId === props.activeId}
            handleClick={props.handleClick}
            showModal={props.showModal}
            GameStatus={session.GameStatus}
            max={max}
            min={min}
            eventId={props.matchId}
            sport={props.sport}
            eventName={props.eventName}
            stakes={props.stakes}
          />
        )
      );
    });
  }

  return (
    <div className={classes.Exchange}>
      {fancyHead}
      {fancyRow}
      {isRulesVisible && <Rules open={isRulesVisible} onClose={toggleRules} />}
    </div>
  );
};

export default Fancy;
