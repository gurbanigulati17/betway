import React from "react";
import Table from "../../../../UI/TableNumber/Table";
import { abbreviateNumber } from "../../../../../utils";
import classes from "./PlaceOrder.module.css";
import BetSpinner from "../../../../UI/Spinner/BetSpinner";

const PlaceOrder = ({
  toggleAcceptAnyOdds,
  accept,
  stakes,
  handleStakeChange,
  setStakeTable,
  backspace,
  clearProfitLoss,
  handleClick,
  setStake,
  placeBet,
  odds,
  decStake,
  incStake,
  stake,
  setStakeManual,
  isBetting,
}) => {
  const isAcceptBox = localStorage.getItem("token");

  const disabled = stake <= 0 || isBetting;

  return (
    <>
      <div className={classes.placeOrder}>
        <h3 className={classes.title}>Place order</h3>
        {isAcceptBox && (
          <div className={classes.acceptBox}>
            <label className={classes.accept} htmlFor="accept">
              Accept any odds
            </label>
            <input
              type="checkbox"
              id="accept"
              name="accept"
              onChange={toggleAcceptAnyOdds}
              checked={accept}
            />
          </div>
        )}
        <div className={classes.orderPanel}>
          <div className={classes.odds}>{odds && <span>{odds}</span>}</div>
          <div className={classes.orderQuantity}>
            <button className={classes.dec} onClick={decStake}>
              <i className="fa fa-minus"></i>
            </button>
            <input
              className={classes.stake}
              type="number"
              value={stake}
              onChange={setStakeManual}
              placeholder="0.00"
            />
            <button className={classes.inc} onClick={incStake}>
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <div className={classes.stakes}>
          {stakes.map((stake) => {
            return (
              <div className={classes.stakeElement} key={stake.key}>
                <button
                  onClick={() => {
                    handleStakeChange(stake.stake);
                  }}
                >
                  {abbreviateNumber(stake.label)}
                </button>
              </div>
            );
          })}
        </div>
        <Table setStakeTable={setStakeTable} backspace={backspace} />
        <div className={classes.action}>
          <div className={classes.placeCancel}>
            <button
              className={`${classes.cancel} btn btn-danger`}
              onClick={() => {
                if (clearProfitLoss) {
                  clearProfitLoss();
                }
                handleClick(null);
                setStake("");
              }}
            >
              Cancel
            </button>
          </div>
          <div className={classes.placeBet}>
            <button
              disabled={disabled}
              onClick={placeBet}
              className={`${classes.place} btn btn-success ${
                disabled ? classes.inactiveBet : ""
              }`}
            >
              <span>Place Bet</span>

              {isBetting && <BetSpinner size="sm" style={{ marginLeft: 8 }} />}
            </button>
          </div>
        </div>
      </div>
      <div className={classes.placeBetOverlay}></div>
    </>
  );
};

export default PlaceOrder;
