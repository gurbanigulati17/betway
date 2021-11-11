import React from "react";
import classes from "./MarketTable.module.css";
import MarketRow from "./MarketRow";

const MarketTable = (props) => {
  let marketRow = null;
  let min = props.min;
  let max = props.adv_max;

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
      />
    );
  });

  return (
    <div className={classes.Exchange}>
      <div className={classes.headGrid}>
        <div className={classes.box}>
          <div className={classes.tableName}>{props.name}</div>
        </div>
        <div className={classes.tiny}>
          Min/Max :- <span>{min + "/" + max}</span>
        </div>
      </div>
      <div className={classes.upperGrid}>
        <div className={classes.textCenter}></div>
        <div className={[classes.textCenter, classes.nameBlue].join(" ")}>
          Back
        </div>
        <div className={[classes.textCenter, classes.namePink].join(" ")}>
          Lay
        </div>
        <div className={[classes.textCenter, classes.mobile].join(" ")}></div>
      </div>
      {marketRow}
    </div>
  );
};

export default MarketTable;
