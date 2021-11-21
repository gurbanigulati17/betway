import React, { useState, useEffect } from "react";
import { useRef } from "react";
import classes from "./MarketTable.module.css";
import back_axios from "../../../../../../axios-instance/backendAPI";
import IP_Axios from "axios";
import bell from "../../../../../../assets/sound/bell.mp3";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import BetSpinner from "../../../../../UI/Spinner/BetSpinner";
import Table from "../../../../../UI/TableNumber/Table";
import BackBlock from "./Odds/BackBock";
import LayBlock from "./Odds/LayBlock";

let audio = new Audio(bell);

const defaultStakes = [
  {
    key: 0,
    label: "100",
    stake: 100,
  },
  {
    key: 1,
    label: "200",
    stake: 200,
  },
  {
    key: 2,
    label: "300",
    stake: 300,
  },
  {
    key: 3,
    label: "500",
    stake: 500,
  },
  {
    key: 4,
    label: "1000",
    stake: 1000,
  },
  {
    key: 5,
    label: "10000",
    stake: 10000,
  },
];

const MarketRow = (props) => {
  const [runnerProfitLoss, setRunnerProfitLoss] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [stake, setStake] = useState("");
  const [odds, setOdds] = useState(0);
  const [selection, setSelection] = useState(null);
  const [bgColor, setBgColor] = useState(classes.lay1);
  const [activeblock, setActiveblock] = useState(null);
  const usertype = useSelector((state) => state.auth.usertype);
  const market = useSelector((state) => state.update.market);
  const isBetting = useSelector((state) => state.update.isBetting);
  const dispatch = useDispatch();
  let btnRef = useRef();

  useEffect(() => {
    getRunnerPL();
    // if (usertype !== '5') {
    //     setIntervalId(setInterval(getRunnerPL, 9000))
    // }
  }, [market, props.updateBook]);

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
      props.setProfitLoss(money, odds, selection);
      return;
    }

    if (money + stake <= 1000000) {
      setStake(money + stake);
      props.setProfitLoss(money + stake, odds, selection);
    }
  };
  const setStakeManual = (event) => {
    if (event.target.value <= 1000000) {
      setStake(event.target.value ? parseFloat(event.target.value) : "");
      props.setProfitLoss(
        parseFloat(event.target.value.replace(/^0+/, "")),
        odds,
        selection
      );
    }
  };
  const setStakeTable = (value) => {
    if (value < 10 && stake * 10 + value <= 1000000) {
      setStake(stake * 10 + value);
      props.setProfitLoss(stake * 10 + value, odds, selection);
    } else if (value >= 10) {
      if (stake * value <= 1000000) {
        setStake(stake * value);
        props.setProfitLoss(stake * value, odds, selection);
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
    props.setProfitLoss(newStake - decimalValue, odds, selection);
  };
  const incStake = () => {
    if (stake) {
      setStake(stake * 2);
      props.setProfitLoss(stake * 2, odds, selection);
    }
  };
  const decStake = () => {
    if (stake) {
      setStake(stake / 2);
      props.setProfitLoss(stake / 2, odds, selection);
    }
  };

  const placeBet = async (odds) => {
    if (!parseFloat(stake)) return;
    else if (!navigator.onLine) return alertify.error("Internet disconnected");
    else if (props.marketStatus === "SUSPENDED")
      return alertify.error("Invalid bet");

    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled");
    }

    let oddsToRecord = parseFloat(odds);

    if (parseFloat(stake)) {
      let IP_Address = null;
      try {
        const ipRes = await IP_Axios.get(
          "https://ipapi.co/json?key=" + process.env.REACT_APP_KEY
        );
        // const ipRes = await IP_Axios.get('https://api.ipdata.co/?api-key=4bf95bafac0f84229d80e1ca593692b046901704044c35e312183a33')
        IP_Address = ipRes.data.ip;

        let otherRunners;

        otherRunners = props.allRunners.filter(
          (runner) => runner !== props.selectionId
        );

        const payload = {
          odds: oddsToRecord,
          selection: selection,
          stake: parseFloat(stake),
          runner: props.selectionId,
          otherRunners: otherRunners,
          event: props.eventId,
          market: props.marketId,
          runnerName: props.name,
          marketName: props.marketName,
          type: "exchange",
          marketId: props.marketId,
          IP_Address: IP_Address,
          manual: props.manual,
          inplay: props.inplay,
          usertype: usertype,
          sport: props.sport,
          eventName: props.eventName,
        };
        if (props.marketName.toLowerCase() === "bookmaker")
          payload.type = "bookmaker";

        dispatch(actions.setBettingStatus());

        back_axios
          .post("/user/matched", payload, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            if (response.data.success) {
              audio.play();
              dispatch(actions.resetBettingStatus());
              dispatch(actions.updateMarketExposure());
              dispatch(actions.updateBalance());
              dispatch(actions.updateCurrentBets());
              alertify.success(response.data.message);
              props.handleClick(null);
              props.clearProfitLoss();
              setStake("");
            } else {
              dispatch(actions.resetBettingStatus());
              alertify.error(response.data.message);
            }
            dispatch(actions.resetMessage());
          })
          .catch((error) => {
            dispatch(actions.resetBettingStatus());
            alertify.error(error.message);
          });
      } catch (err) {
        return alertify.error("IP Address not found! Please try again");
      }
    }
  };
  const getRunnerPL = () => {
    if (localStorage.getItem("token")) {
      back_axios
        .get(
          "/user/getRunnerPL/" +
            props.eventId +
            "/" +
            props.marketId +
            "/" +
            props.selectionId,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            if (response.data.data != null) {
              setRunnerProfitLoss(response.data.data);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  let back = null,
    lay = null,
    ProfitLoss = null,
    allStakes = null;

  if (props.stakes) {
    allStakes = props.stakes.map((stake) => {
      return (
        <div className={classes.textCenter} key={stake.key}>
          <button
            onClick={() => {
              handleStakeChange(stake.stake);
            }}
          >
            {stake.label}
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
            {stake.label}
          </button>
        </div>
      );
    });
  }

  let lower = (
    <div>
      {localStorage.getItem("token") ? (
        <div className={classes.acceptBox}>
          <label className={classes.accept} htmlFor="accept">
            Accept any odds
          </label>
          <input
            type="checkbox"
            id="accept"
            name="accept"
            onChange={props.toggleAcceptAnyOdds}
            checked={props.accept}
          />
        </div>
      ) : null}
      <div className={classes.lowerGrid}>
        {localStorage.getItem("token") ? (
          <div className={classes.lowerAcceptBox}>
            <label className={classes.accept} htmlFor="accept">
              Accept any odds
            </label>
            <input
              type="checkbox"
              id="accept"
              name="accept"
              onChange={props.toggleAcceptAnyOdds}
              checked={props.accept}
            />
          </div>
        ) : null}
        <div className={classes.textCenter}>
          <button
            className={classes.cancel}
            onClick={() => {
              props.clearProfitLoss();
              props.handleClick(null);
              setStake("");
            }}
          >
            Cancel
          </button>
        </div>
        <div>
          <p className={classes.odds}>{odds}</p>
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
        <div className={classes.textCenter}>
          <button
            ref={btnRef}
            disabled={isBetting}
            onClick={() => {
              placeBet(odds);
            }}
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
    lower = <BetSpinner />;
  }

  if (props.profitLoss < 0) {
    ProfitLoss = (
      <span style={{ color: "red" }}>
        ({parseFloat(props.profitLoss).toFixed(2)})
      </span>
    );
  } else if (props.profitLoss > 0) {
    ProfitLoss = (
      <span style={{ color: "green" }}>
        ({parseFloat(props.profitLoss).toFixed(2)})
      </span>
    );
  }

  if (
    (props.status !== "ACTIVE" && props.marketStatus !== "OPEN") ||
    props.marketStatus === "SUSPENDED" ||
    props.marketStatus === "INACTIVE"
  ) {
    back = (
      <>
        <div
          className={classes.mobile}
          style={{ backgroundColor: "#f2f2f2" }}
        ></div>
        <div
          className={classes.mobile}
          style={{ backgroundColor: "#f2f2f2" }}
        ></div>
        <div
          style={{ backgroundColor: "#f2f2f2", color: "red", textAlign: "end" }}
        >
          SUSPE
        </div>
      </>
    );
    lay = (
      <>
        <div
          style={{
            backgroundColor: "#f2f2f2",
            color: "red",
            textAlign: "start",
          }}
        >
          NDED
        </div>
        <div
          className={classes.mobile}
          style={{ backgroundColor: "#f2f2f2" }}
        ></div>
        <div
          className={classes.mobile}
          style={{ backgroundColor: "#f2f2f2" }}
        ></div>
      </>
    );
  } else {
    back = (
      <>
        <div
          className={[
            classes.textCenter,
            classes.back3,
            classes.mobile,
            props.isActive && activeblock === 1 ? classes.activeBack : "",
          ].join(" ")}
          onClick={() => {
            if (
              props.availableToBack &&
              props.availableToBack.length &&
              props.availableToBack[
                props.availableToBack.length - 1 + props.shift
              ]?.price &&
              usertype === "5"
            ) {
              if (!isBetting) {
                props.clearProfitLoss();
                props.handleClick(props.selectionId + props.marketId);
                setActiveblock(1);
                setOdds(
                  props.availableToBack[
                    props.availableToBack.length - 1 + props.shift
                  ].price
                );
                setSelection("back");
                setBgColor(classes.back3);
                props.setProfitLoss(
                  stake,
                  props.availableToBack[
                    props.availableToBack.length - 1 + props.shift
                  ].price,
                  "back"
                );
              }
            }
          }}
        >
          <BackBlock
            availableToBack={props.availableToBack}
            tiny={classes.tiny}
            shift={props.shift}
            num={1}
          />
        </div>
        <div
          className={[
            classes.textCenter,
            classes.back2,
            classes.mobile,
            props.isActive && activeblock === 2 ? classes.activeBack : "",
          ].join(" ")}
          onClick={() => {
            if (
              props.availableToBack &&
              props.availableToBack[
                props.availableToBack.length - 2 + props.shift
              ]?.price &&
              usertype === "5"
            ) {
              if (!isBetting) {
                props.clearProfitLoss();
                props.handleClick(props.selectionId + props.marketId);
                setActiveblock(2);
                setOdds(
                  props.availableToBack[
                    props.availableToBack.length - 2 + props.shift
                  ].price
                );
                setSelection("back");
                setBgColor(classes.back3);
                props.setProfitLoss(
                  stake,
                  props.availableToBack[
                    props.availableToBack.length - 2 + props.shift
                  ].price,
                  "back"
                );
              }
            }
          }}
        >
          <BackBlock
            availableToBack={props.availableToBack}
            tiny={classes.tiny}
            shift={props.shift}
            num={2}
          />
        </div>
        <div
          className={[
            classes.textCenter,
            classes.back1,
            props.isActive && activeblock === 3 ? classes.activeBack : "",
          ].join(" ")}
          onClick={() => {
            if (
              props.availableToBack &&
              props.availableToBack[
                props.availableToBack.length - 3 + props.shift
              ]?.price &&
              usertype === "5"
            ) {
              if (!isBetting) {
                props.clearProfitLoss();
                props.handleClick(props.selectionId + props.marketId);
                setActiveblock(3);
                setOdds(
                  props.availableToBack[
                    props.availableToBack.length - 3 + props.shift
                  ].price
                );
                setSelection("back");
                setBgColor(classes.back3);
                props.setProfitLoss(
                  stake,
                  props.availableToBack[
                    props.availableToBack.length - 3 + props.shift
                  ].price,
                  "back"
                );
              }
            }
          }}
        >
          <BackBlock
            availableToBack={props.availableToBack}
            tiny={classes.tiny}
            shift={props.shift}
            num={3}
          />
        </div>
      </>
    );
    if (props.marketName.toLowerCase() === "bookmaker") {
      lay = (
        <>
          <div
            className={[
              classes.textCenter,
              classes.lay1,
              props.isActive && activeblock === 4 ? classes.activeLay : "",
            ].join(" ")}
            onClick={() => {
              if (
                props.availableToLay &&
                props.availableToLay[0]?.price &&
                usertype === "5"
              ) {
                if (!isBetting) {
                  props.clearProfitLoss();
                  props.handleClick(props.selectionId + props.marketId);
                  setActiveblock(4);
                  setOdds(
                    props.availableToLay[0]?.price > 1
                      ? parseFloat(
                          (
                            props.availableToBack[
                              props.availableToBack.length - 3 + props.shift
                            ].price + 0.01
                          ).toFixed(2)
                        )
                      : props.availableToLay[0]?.price
                  );
                  setSelection("lay");
                  setBgColor(classes.lay3);
                  props.setProfitLoss(
                    stake,
                    props.availableToLay[0]?.price > 1
                      ? parseFloat(
                          (
                            props.availableToBack[
                              props.availableToBack.length - 3 + props.shift
                            ].price + 0.01
                          ).toFixed(2)
                        )
                      : props.availableToLay[0]?.price,
                    "lay"
                  );
                }
              }
            }}
          >
            <LayBlock
              availableToLay={props.availableToLay}
              availableToBack={props.availableToBack}
              marketName={props.marketName}
              shift={props.shift}
              tiny={classes.tiny}
              bnum={3}
              num={0}
            />
          </div>
          <div
            className={[
              classes.textCenter,
              classes.lay2,
              classes.mobile,
              props.isActive && activeblock === 5 ? classes.activeLay : "",
            ].join(" ")}
            onClick={() => {
              if (
                props.availableToLay &&
                props.availableToLay[1]?.price &&
                usertype === "5"
              ) {
                if (!isBetting) {
                  props.clearProfitLoss();
                  props.handleClick(props.selectionId + props.marketId);
                  setActiveblock(5);
                  setOdds(
                    props.availableToLay[1]?.price > 1
                      ? parseFloat(
                          (
                            props.availableToBack[
                              props.availableToBack.length - 2 + props.shift
                            ].price + 0.01
                          ).toFixed(2)
                        )
                      : props.availableToLay[1]?.price
                  );
                  setSelection("lay");
                  setBgColor(classes.lay3);
                  props.setProfitLoss(
                    stake,
                    props.availableToLay[1]?.price > 1
                      ? parseFloat(
                          (
                            props.availableToBack[
                              props.availableToBack.length - 2 + props.shift
                            ].price + 0.01
                          ).toFixed(2)
                        )
                      : props.availableToLay[1]?.price,
                    "lay"
                  );
                }
              }
            }}
          >
            <LayBlock
              availableToLay={props.availableToLay}
              availableToBack={props.availableToBack}
              marketName={props.marketName}
              shift={props.shift}
              tiny={classes.tiny}
              bnum={2}
              num={1}
            />
          </div>
          <div
            className={[
              classes.textCenter,
              classes.lay3,
              classes.mobile,
              props.isActive && activeblock === 6 ? classes.activeLay : "",
            ].join(" ")}
            onClick={() => {
              if (
                props.availableToLay &&
                props.availableToLay[2]?.price &&
                usertype === "5"
              ) {
                if (!isBetting) {
                  props.clearProfitLoss();
                  props.handleClick(props.selectionId + props.marketId);
                  setActiveblock(6);
                  setOdds(
                    props.availableToLay[2]?.price > 1
                      ? parseFloat(
                          (
                            props.availableToBack[
                              props.availableToBack.length - 1 + props.shift
                            ].price + 0.01
                          ).toFixed(2)
                        )
                      : props.availableToLay[2]?.price
                  );
                  setSelection("lay");
                  setBgColor(classes.lay3);
                  props.setProfitLoss(
                    stake,
                    props.availableToLay[2]?.price > 1
                      ? parseFloat(
                          (
                            props.availableToBack[
                              props.availableToBack.length - 1 + props.shift
                            ].price + 0.01
                          ).toFixed(2)
                        )
                      : props.availableToLay[2]?.price,
                    "lay"
                  );
                }
              }
            }}
          >
            <LayBlock
              availableToLay={props.availableToLay}
              availableToBack={props.availableToBack}
              marketName={props.marketName}
              shift={props.shift}
              tiny={classes.tiny}
              bnum={1}
              num={2}
            />
          </div>
        </>
      );
    } else {
      lay = (
        <>
          <div
            className={[
              classes.textCenter,
              classes.lay1,
              props.isActive && activeblock === 4 ? classes.activeLay : "",
            ].join(" ")}
            onClick={() => {
              if (
                props.availableToLay &&
                props.availableToLay[0]?.price &&
                usertype === "5"
              ) {
                if (!isBetting) {
                  props.clearProfitLoss();
                  props.handleClick(props.selectionId + props.marketId);
                  setActiveblock(4);
                  setOdds(props.availableToLay[0].price);
                  setSelection("lay");
                  setBgColor(classes.lay3);
                  props.setProfitLoss(
                    stake,
                    props.availableToLay[0].price,
                    "lay"
                  );
                }
              }
            }}
          >
            <LayBlock
              availableToLay={props.availableToLay}
              availableToBack={props.availableToBack}
              marketName={props.marketName}
              shift={props.shift}
              tiny={classes.tiny}
              bnum={3}
              num={0}
            />
          </div>
          <div
            className={[
              classes.textCenter,
              classes.lay2,
              classes.mobile,
              props.isActive && activeblock === 5 ? classes.activeLay : "",
            ].join(" ")}
            onClick={() => {
              if (
                props.availableToLay &&
                props.availableToLay[1]?.price &&
                usertype === "5"
              ) {
                if (!isBetting) {
                  props.clearProfitLoss();
                  props.handleClick(props.selectionId + props.marketId);
                  setActiveblock(5);
                  setOdds(props.availableToLay[1].price);
                  setSelection("lay");
                  setBgColor(classes.lay3);
                  props.setProfitLoss(
                    stake,
                    props.availableToLay[1].price,
                    "lay"
                  );
                }
              }
            }}
          >
            <LayBlock
              availableToLay={props.availableToLay}
              availableToBack={props.availableToBack}
              marketName={props.marketName}
              shift={props.shift}
              tiny={classes.tiny}
              bnum={2}
              num={1}
            />
          </div>
          <div
            className={[
              classes.textCenter,
              classes.lay3,
              classes.mobile,
              props.isActive && activeblock === 6 ? classes.activeLay : "",
            ].join(" ")}
            onClick={() => {
              if (
                props.availableToLay &&
                props.availableToLay[2]?.price &&
                usertype === "5"
              ) {
                if (!isBetting) {
                  props.clearProfitLoss();
                  props.handleClick(props.selectionId + props.marketId);
                  setActiveblock(6);
                  setOdds(props.availableToLay[2].price);
                  setSelection("lay");
                  setBgColor(classes.lay3);
                  props.setProfitLoss(
                    stake,
                    props.availableToLay[2].price,
                    "lay"
                  );
                }
              }
            }}
          >
            <LayBlock
              availableToLay={props.availableToLay}
              availableToBack={props.availableToBack}
              marketName={props.marketName}
              shift={props.shift}
              tiny={classes.tiny}
              bnum={1}
              num={2}
            />
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div className={classes.midGrid}>
        <div className={classes.textLeft}>
          <div> {props.name}</div>
          <div className={classes.tiny}>
            <span
              style={{
                fontSize: "1.2em",
                color: runnerProfitLoss <= 0 ? "red" : "green",
              }}
            >
              {"-->" + runnerProfitLoss}
            </span>
            {ProfitLoss}
          </div>
        </div>
        {back}
        {lay}
      </div>
      <div
        className={[
          props.isActive ? classes.dblock : classes.dNone,
          isBetting ? null : bgColor,
        ].join(" ")}
        style={{ cursor: "default" }}
      >
        {lower}
      </div>
    </>
  );
};

export default MarketRow;
