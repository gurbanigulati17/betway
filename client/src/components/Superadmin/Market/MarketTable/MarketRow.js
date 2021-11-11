import React, { useState, useEffect } from "react";
import classes from "./MarketTable.module.css";
import axios from "../../../../axios-instance/backendAPI";

const MarketRow = (props) => {
  let back = null,
    lay = null;
  const [runnerProfitLoss, setRunnerProfitLoss] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const getRunnerPL = () => {
    if (localStorage.getItem("a_token")) {
      axios
        .get(
          "/superadmin/getRunnerPL/" +
            props.eventId +
            "/" +
            props.marketId +
            "/" +
            props.selectionId,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("a_token"),
            },
          }
        )
        .then((response) => {
          if (
            response.data.success &&
            response.data.data.length &&
            response.data.data[0].netProfit != null
          ) {
            setRunnerProfitLoss(response.data.data[0].netProfit);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getRunnerPL();
    setIntervalId(setInterval(getRunnerPL, 3000));
  }, []);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [intervalId]);

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
      </>
    );
    lay = (
      <>
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
    if (props.availableToBack) {
      back = (
        <>
          <div
            className={[classes.textCenter, classes.back3, classes.mobile].join(
              " "
            )}
            aria-controls="fade-text"
            aria-expanded={props.toggleState}
          >
            <div>
              {props.availableToBack &&
              props.availableToBack[
                props.availableToBack.length - 1 + props.shift
              ] &&
              props.availableToBack[
                props.availableToBack.length - 1 + props.shift
              ].price
                ? props.availableToBack[
                    props.availableToBack.length - 1 + props.shift
                  ].price
                : 0}
            </div>
            <div className={classes.tiny}>
              {" "}
              {props.availableToBack &&
              props.availableToBack[
                props.availableToBack.length - 1 + props.shift
              ]
                ? props.availableToBack[
                    props.availableToBack.length - 1 + props.shift
                  ].size > 1000
                  ? (
                      props.availableToBack[
                        props.availableToBack.length - 1 + props.shift
                      ].size / 1000
                    ).toFixed(2) + "k"
                  : props.availableToBack[
                      props.availableToBack.length - 1 + props.shift
                    ].size
                : null}
            </div>
          </div>
          <div
            className={[classes.textCenter, classes.back2, classes.mobile].join(
              " "
            )}
            aria-controls="fade-text"
            aria-expanded={props.toggleState}
          >
            <div>
              {" "}
              {props.availableToBack &&
              props.availableToBack[
                props.availableToBack.length - 2 + props.shift
              ] &&
              props.availableToBack[
                props.availableToBack.length - 2 + props.shift
              ].price
                ? props.availableToBack[
                    props.availableToBack.length - 2 + props.shift
                  ].price
                : 0}
            </div>
            <div className={classes.tiny}>
              {" "}
              {props.availableToBack &&
              props.availableToBack[
                props.availableToBack.length - 2 + props.shift
              ]
                ? parseFloat(
                    props.availableToBack[
                      props.availableToBack.length - 2 + props.shift
                    ].size
                  ) > 1000
                  ? (
                      props.availableToBack[
                        props.availableToBack.length - 2 + props.shift
                      ].size / 1000
                    ).toFixed(2) + "k"
                  : props.availableToBack[
                      props.availableToBack.length - 2 + props.shift
                    ].size
                : null}
            </div>
          </div>
          <div
            className={[classes.textCenter, classes.back1].join(" ")}
            aria-controls="fade-text"
            aria-expanded={props.toggleState}
          >
            <div>
              {" "}
              {props.availableToBack &&
              props.availableToBack[
                props.availableToBack.length - 3 + props.shift
              ] &&
              props.availableToBack[
                props.availableToBack.length - 3 + props.shift
              ].price
                ? props.availableToBack[
                    props.availableToBack.length - 3 + props.shift
                  ].price
                : 0}
            </div>
            <div className={classes.tiny}>
              {" "}
              {props.availableToBack &&
              props.availableToBack[
                props.availableToBack.length - 3 + props.shift
              ]
                ? props.availableToBack[
                    props.availableToBack.length - 3 + props.shift
                  ].size > 1000
                  ? (
                      props.availableToBack[
                        props.availableToBack.length - 3 + props.shift
                      ].size / 1000
                    ).toFixed(2) + "k"
                  : props.availableToBack[
                      props.availableToBack.length - 3 + props.shift
                    ].size
                : null}
            </div>
          </div>
        </>
      );
    }
    if (props.availableToLay) {
      lay = (
        <>
          <div
            className={[classes.textCenter, classes.lay1].join(" ")}
            aria-controls="fade-text"
            aria-expanded={props.toggleState}
          >
            <div>
              {" "}
              {props.availableToLay &&
              props.availableToLay[0] &&
              props.availableToLay[0].price
                ? props.availableToLay[0].price
                : 0}
            </div>
            <div className={classes.tiny}>
              {" "}
              {props.availableToLay && props.availableToLay[0]
                ? props.availableToLay[0].size > 1000
                  ? (props.availableToLay[0].size / 1000).toFixed(2) + "k"
                  : props.availableToLay[0].size
                : null}
            </div>
          </div>
          <div
            className={[classes.textCenter, classes.lay2, classes.mobile].join(
              " "
            )}
            aria-controls="fade-text"
            aria-expanded={props.toggleState}
          >
            <div>
              {" "}
              {props.availableToLay &&
              props.availableToLay[1] &&
              props.availableToLay[1].price
                ? props.availableToLay[1].price
                : 0}
            </div>
            <div className={classes.tiny}>
              {" "}
              {props.availableToLay && props.availableToLay[1]
                ? props.availableToLay[1].size > 1000
                  ? (props.availableToLay[1].size / 1000).toFixed(2) + "k"
                  : props.availableToLay[1].size
                : null}
            </div>
          </div>
          <div
            className={[classes.textCenter, classes.lay3, classes.mobile].join(
              " "
            )}
            aria-controls="fade-text"
            aria-expanded={props.toggleState}
          >
            <div>
              {" "}
              {props.availableToLay &&
              props.availableToLay[2] &&
              props.availableToLay[2].price
                ? props.availableToLay[2].price
                : 0}
            </div>
            <div className={classes.tiny}>
              {" "}
              {props.availableToLay && props.availableToLay[2]
                ? props.availableToLay[2].size > 1000
                  ? (props.availableToLay[2].size / 1000).toFixed(2) + "k"
                  : props.availableToLay[2].size
                : null}
            </div>
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
                color: runnerProfitLoss <= 0 ? "#b21318" : "#046f04",
                fontWeight: "bold",
              }}
            >
              {runnerProfitLoss}
            </span>
          </div>
        </div>
        {back}
        {lay}
      </div>
    </>
  );
};

export default MarketRow;
