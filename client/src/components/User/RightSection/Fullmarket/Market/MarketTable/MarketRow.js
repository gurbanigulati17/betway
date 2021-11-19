import React, { useState, useEffect } from "react";
import classes from "./MarketTable.module.css";
import back_axios from "../../../../../../axios-instance/backendAPI";
import IP_Axios from "axios";
import bell from "../../../../../../assets/sound/bell.mp3";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../../store/actions/index";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import BackBlock from "./Odds/BackBock";
import LayBlock from "./Odds/LayBlock";
import PlaceOrder from "../../PlaceOrder";

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

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

    let oddsToRecord = parseFloat(odds);

    dispatch(actions.setBettingStatus());
    if (parseFloat(stake)) {
      let IP_Address = null;
      try {
        const ipRes = await IP_Axios.get(
          "https://ipapi.co/json?key=" + process.env.REACT_APP_KEY
        );
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
        if (props.marketName.toLowerCase() === "bookmaker") {
          payload.type = "bookmaker";
        }

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
        dispatch(actions.resetBettingStatus());
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
    ProfitLoss = null;

  let lower = (
    <PlaceOrder
      toggleAcceptAnyOdds={props.toggleAcceptAnyOdds}
      accept={props.accept}
      stakes={props?.stake?.length ? props?.stake : defaultStakes}
      handleStakeChange={handleStakeChange}
      setStakeTable={setStakeTable}
      backspace={backspace}
      clearProfitLoss={props.clearProfitLoss}
      handleClick={props.handleClick}
      setStake={setStake}
      placeBet={debounce(() => placeBet(odds))}
      odds={odds}
      decStake={decStake}
      incStake={incStake}
      stake={stake}
      setStakeManual={setStakeManual}
      isBetting={isBetting}
      selection={selection}
    />
  );

  if (props.profitLoss < 0) {
    ProfitLoss = (
      <span className="loss">({parseFloat(props.profitLoss).toFixed(2)})</span>
    );
  } else if (props.profitLoss > 0) {
    ProfitLoss = (
      <span className="profit">
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
      <div className={classes.suspended}>
        <span>SUSPENDED</span>
      </div>
    );
    lay = null;
  } else {
    back = (
      <>
        <div
          className={[
            classes.back3,
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
            classes.back2,
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
              classes.lay2,
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
              classes.lay3,
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
              classes.lay2,
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
              classes.lay3,
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
    <div className={classes.betGrid}>
      <div className={classes.betGridAttributes}>
        <div className={classes.betNameWarpper}>
          <div className={classes.name}> {props.name}</div>
          <div className={classes.profitLoss}>
            <span
              className={runnerProfitLoss < 0 ? classes.loss : classes.profit}
            >
              {runnerProfitLoss}
            </span>
            <span
              className={runnerProfitLoss < 0 ? classes.loss : classes.profit}
            >
              {ProfitLoss}
            </span>
          </div>
        </div>
        <div className={classes.backLayWrapper}>
          {back}
          {lay}
        </div>
      </div>
      {props.isActive && lower}
    </div>
  );
};

export default MarketRow;
