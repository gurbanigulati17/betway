import React, { useState } from "react";
import classes from "./MarketTable.module.css";
import MarketRow from "./MarketRow";
import { useSelector } from "react-redux";
import classnames from "classnames";

import Rules from "../../../../../UI/Rules";

const MarketTable = (props) => {
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [selection, setSelection] = useState(null);
  const [updateBook, setUpdateBook] = useState(false);
  const usertype = useSelector((state) => state.auth.usertype);
  const [isRulesVisible, setRules] = useState(false);

  const toggleRules = () => setRules((prev) => !prev);

  const toggleUpdateBook = () => {
    setUpdateBook((prevValue) => {
      return !prevValue;
    });
  };

  const setProfitLoss = (stake, odds, selection) => {
    if (selection === "back") {
      setProfit(stake * (odds - 1));
      setLoss(-stake);
      setSelection(selection);
    } else if (selection === "lay") {
      setProfit(stake);
      setLoss(-stake * (odds - 1));
      setSelection(selection);
    }
  };
  const clearProfitLoss = () => {
    setProfit(0);
    setLoss(0);
  };

  let marketRow = null;
  let min = props.min;
  let max = props.adv_max;

  let PL_1 = profit,
    PL_2 = loss;

  if (selection && selection === "lay") {
    PL_1 = loss;
    PL_2 = profit;
  }

  const allRunners = [];
  props.runners.forEach((runner) => {
    allRunners.push(runner.selectionId);
  });
  marketRow = props.runners.map((runner) => {
    let reqRunner = null;
    if (props.odds && props.odds.length) {
      reqRunner = props.odds[0].runners?.filter(
        (odds_runner) =>
          parseFloat(odds_runner.selectionId) === parseFloat(runner.selectionId)
      )[0];

      if (props.odds[0].inplay) {
        max = props.max;
      }
    }
    return (
      <MarketRow
        name={runner.name}
        allRunners={allRunners}
        selectionId={runner.selectionId}
        key={runner.selectionId + props.marketId}
        marketId={props.marketId}
        marketName={props.name}
        adv_max={props.adv_max}
        min={props.min}
        max={props.max}
        eventId={props.eventId}
        showRunnerPL={props.showRunnerPL}
        sport={props.sport}
        eventName={props.eventName}
        shift={reqRunner ? 3 - reqRunner.ex.availableToBack?.length : 0}
        marketStatus={reqRunner ? props.odds[0].status : "SUSPENDED"}
        inplay={reqRunner ? props.odds[0].inplay : false}
        status={reqRunner ? reqRunner.status : "SUSPENDED"}
        availableToBack={reqRunner ? reqRunner.ex.availableToBack : []}
        availableToLay={reqRunner ? reqRunner.ex.availableToLay : []}
        setProfitLoss={setProfitLoss}
        profitLoss={
          runner.selectionId + props.marketId === props.activeId ? PL_1 : PL_2
        }
        clearProfitLoss={clearProfitLoss}
        isActive={runner.selectionId + props.marketId === props.activeId}
        handleClick={props.handleClick}
        updateBook={updateBook}
        accept={props.accept}
        stakes={props.stakes}
        toggleAcceptAnyOdds={props.toggleAcceptAnyOdds}
      />
    );
  });

  return (
    <div className={classes.Exchange}>
      <div className={classes.title}>
        <div
          className={classnames(
            classes.box,
            usertype !== "5" ? classes.extraMargin : ""
          )}
        >
          <span style={{ marginRight: 8 }}>{props.name}</span>
          <span onClick={toggleRules} className={classes.infoWrapper}>
            <i className={`${classes.info} fa fa-info-circle`}></i>
          </span>
        </div>
        {usertype === "5" ? null : (
          <button
            className={classnames("btn btn-primary", classes.viewBtn)}
            onClick={() => {
              if (window.innerWidth < 1000) {
                const elem = document.getElementById("main");
                elem.scrollTo({
                  top: elem.scrollHeight,
                  left: 0,
                  behavior: "smooth",
                });
              }
              props.changeFlag();
              props.changeMarket(props.marketId, props.eventId);
              toggleUpdateBook();
            }}
          >
            View
          </button>
        )}
      </div>
      <div className={classes.head}>
        <div className={classes.maxMin}>
          <span>Min/Max :- </span>
          <span>{min + "/" + max}</span>
        </div>
        <div className={[classes.headTitle, classes.titleBack].join(" ")}>
          Back
        </div>
        <div className={[classes.headTitle, classes.titleLay].join(" ")}>
          Lay
        </div>
      </div>
      {marketRow}
      <Rules open={isRulesVisible} onClose={toggleRules} />
    </div>
  );
};

export default MarketTable;
