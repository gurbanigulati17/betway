import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Button } from "@material-ui/core";
import classes from "./FancyTable.module.css";
import axios from "../../../../../../axios-instance/backendAPI";
import IP_Axios from "axios";
import bell from "../../../../../../assets/sound/bell.mp3";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";
import BetSpinner from "../../../../../UI/Spinner/BetSpinner";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import Table from "../../../../../UI/TableNumber/Table";
import { abbreviateNumber } from "../../../../../../utils";

const defaultStakes = [
  {
    key: 0,
    label: "1000",
    stake: 1000,
  },
  {
    key: 1,
    label: "5000",
    stake: 5000,
  },
  {
    key: 2,
    label: "10000",
    stake: 10000,
  },
  {
    key: 3,
    label: "25000",
    stake: 25000,
  },
  {
    key: 4,
    label: "50000",
    stake: 50000,
  },
  {
    key: 5,
    label: "100000",
    stake: 100000,
  },
  {
    key: 6,
    label: "200000",
    stake: 200000,
  },
  {
    key: 7,
    label: "500000",
    stake: 500000,
  },
];

let audio = new Audio(bell);

const bl = "Ball";
const sus = "SUSPENDED";

const FancyRow = (props) => {
  const [stake, setStake] = useState("");
  let btnRef = useRef();
  const [price, setPrice] = useState(0);
  const [size, setSize] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [selection, setSelection] = useState(null);
  const [bgColor, setBgColor] = useState(classes.lay1);
  const [activeblock, setActiveblock] = useState(null);
  const usertype = useSelector((state) => state.auth.usertype);
  const [intervalId, setIntervalId] = useState(null);
  const fancy = useSelector((state) => state.update.fancy);
  const isBetting = useSelector((state) => state.update.isBetting);
  const dispatch = useDispatch();

  useEffect(() => {
    getRunnerExposure();
    // if (usertype !== '5') {
    //     setIntervalId(setInterval(getRunnerExposure, 9000))
    // }
  }, [fancy]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [intervalId]);

  const handleStakeChange = (money) => {
    if (stake === "") {
      setStake(money);
      return;
    }
    if (money + stake <= 1000000) {
      setStake(money + stake);
    }
  };
  const setStakeManual = (event) => {
    if (event.target.value <= 1000000) {
      setStake(event.target.value ? parseFloat(event.target.value) : "");
    }
  };
  const setStakeTable = (value) => {
    if (value < 10 && stake * 10 + value <= 1000000) {
      setStake(stake * 10 + value);
    } else if (value >= 10) {
      if (stake * value <= 1000000) {
        setStake(stake * value);
      }
    }
  };
  const backspace = () => {
    if (stake < 10) {
      setStake("");
      return;
    }
    const newStake = stake / 10;
    const decimalValue = stake / 10 - Math.floor(stake / 10);
    setStake(newStake - decimalValue);
  };
  const incStake = () => {
    if (stake) {
      setStake(stake * 2);
    }
  };
  const decStake = () => {
    if (stake) {
      setStake(stake / 2);
    }
  };

  const placeBet = async () => {
    if (!navigator.onLine) {
      alert("Internet disconnected");
      return;
    }
    if (props.GameStatus === sus) {
      alertify.error("Invalid bet");
      return;
    }

    if (!parseFloat(stake)) {
      return;
    }

    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled");
    }

    let IP_Address = null;
    try {
      const ipRes = await IP_Axios.get(
        "https://ipapi.co/json?key=" + process.env.REACT_APP_KEY
        // "https://api.ipdata.co/?api-key=4bf95bafac0f84229d80e1ca593692b046901704044c35e312183a33"
      );
      IP_Address = ipRes.data.ip;
    } catch (err) {
      return alertify.error("IP Address not found! Please try again");
    }

    dispatch(actions.setBettingStatus());

    const payload = {
      odds: parseFloat(size),
      user_rate: parseFloat(price),
      selection: selection,
      stake: parseFloat(stake),
      runnerName: props.name,
      runner: props.id,
      eventName: props.eventName,
      event: props.eventId,
      sport: props.sport,
      type: "fancy",
      IP_Address: IP_Address,
      usertype: usertype,
    };
    axios
      .post("/user/fancy", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          audio.play();
          dispatch(actions.resetBettingStatus());
          dispatch(actions.updateFancyExposure());
          dispatch(actions.updateBalance());
          dispatch(actions.updateCurrentBets());
          props.handleClick(null);
          setStake("");
          alertify.success(response.data.message);
        } else {
          dispatch(actions.resetBettingStatus());
          alertify.error(response.data.message);
        }
        dispatch(actions.resetMessage());
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getRunnerExposure = () => {
    if (localStorage.getItem("token")) {
      axios
        .get("/user/getRunnerExposure/" + props.eventId + "/" + props.id, {
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
    }
  };

  let allStakes = null;

  if (props.stakes) {
    allStakes = props.stakes.map((stake) => {
      return (
        <div className={classes.textCenter} key={stake.key}>
          <button
            onClick={() => {
              handleStakeChange(stake.stake);
            }}
          >
            {abbreviateNumber(stake.label)}
          </button>
        </div>
      );
    });
  } else {
    allStakes = defaultStakes.map((stake) => {
      return (
        <div className={classes.textCenter} key={stake.key}>
          <button
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleStakeChange(stake.stake);
            }}
          >
            {abbreviateNumber(stake.label)}
          </button>
        </div>
      );
    });
  }

  let value = (
    <>
      <div
        className={[
          classes.lay,
          props.isActive && activeblock === 2 ? classes.activeLay : "",
        ].join(" ")}
        onClick={() => {
          if (parseFloat(props.backPrice1) && usertype === "5") {
            props.handleClick(props.id);
            setPrice(props.layPrice1);
            setSize(props.laySize1);
            setSelection("lay");
            setBgColor(classes.lowerLay);
            setActiveblock(2);
          }
        }}
      >
        <div> {props.layPrice1}</div>
        <div className={classes.tiny}> {props.laySize1}</div>
      </div>
      <div
        className={[
          classes.back,
          props.isActive && activeblock === 1 ? classes.activeBack : "",
        ].join(" ")}
        onClick={() => {
          if (parseFloat(props.backPrice1) && usertype === "5") {
            props.handleClick(props.id);
            setPrice(props.backPrice1);
            setSize(props.backSize1);
            setSelection("back");
            setBgColor(classes.lowerBack);
            setActiveblock(1);
          }
        }}
      >
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
          BALL RU
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
  let lower = (
    <div className={classes.gridWrapper}>
      <div className={classes.lowerGrid}>
        <div className={classes.cancelCol}>
          <button
            className={classes.cancel}
            onClick={() => {
              props.handleClick(null);
              setStake("");
            }}
          >
            Cancel
          </button>
        </div>
        <div>
          <p className={classes.weight}>
            <span>{price}</span>
            <span>{size}</span>
          </p>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <div>
              <button className={classes.dec} onClick={decStake}>
                -
              </button>
            </div>
            <input
              className={classes.stake}
              type="number"
              value={stake}
              onChange={setStakeManual}
              placeholder="0.00"
            />
            <div>
              <button className={classes.inc} onClick={incStake}>
                +
              </button>
            </div>
          </div>
        </div>
        <div className={classes.placeOrder}>
          <button
            disabled={isBetting}
            onClick={placeBet}
            className={
              stake <= 0 || isBetting ? classes.inactiveBet : classes.activeBet
            }
          >
            Place Bet
          </button>
        </div>
      </div>
      <div className={classes.bottomGrid}>{allStakes}</div>
      <Table setStakeTable={setStakeTable} backspace={backspace} />
    </div>
  );

  if (isBetting) {
    lower = <BetSpinner width="150px" />;
  }

  return (
    <>
      <div className={classes.midGrid}>
        <div className={classes.textLeft}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ textAlign: "left" }}> {props.name} </div>
            <div
              className={classes.tiny}
              style={{ textAlign: "left", justifyContent: "start" }}
            >
              <span
                style={{
                  fontSize: "1.2em",
                  color: "#b21318",
                  fontWeight: "bold",
                }}
              >
                {exposure ? "" + exposure.toFixed(2) : "0"}
              </span>
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.showModal(props.id);
            }}
            className={classes.book}
          >
            Book
          </Button>
        </div>
        <div className={classes.odds}>{value}</div>
      </div>
      <div
        className={[
          props.isActive ? classes.dblock : classes.dNone,
          isBetting ? null : bgColor,
        ].join(" ")}
      >
        {lower}
      </div>
    </>
  );
};

export default FancyRow;
