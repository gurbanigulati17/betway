import * as actionTypes from "./actionTypes";

export const updateBalance = () => {
  return {
    type: actionTypes.UPDATE_BALANCE,
  };
};

export const updateMarketExposure = () => {
  return {
    type: actionTypes.UPDATE_MARKET_EXPOSURE,
  };
};

export const updateFancyExposure = () => {
  return {
    type: actionTypes.UPDATE_FANCY_EXPOSURE,
  };
};

export const updateCurrentBets = () => {
  return {
    type: actionTypes.UPDATE_CURRENT_BETS,
  };
};

export const setBettingStatus = () => {
  return {
    type: actionTypes.SET_BETTING_STATUS,
  };
};

export const resetBettingStatus = () => {
  return {
    type: actionTypes.RESET_BETTING_STATUS,
  };
};

export const resetMessage = () => {
  return {
    type: actionTypes.RESET_MESSAGE,
  };
};
