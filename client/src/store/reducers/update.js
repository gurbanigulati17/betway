import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  balance: false,
  market: false,
  fancy: false,
  currentBets: false,
  isBetting: false,
  message: false,
};

const updateBalance = (state, action) => {
  return updateObject(state, { balance: !state.balance });
};

const updateMarketExposure = (state, action) => {
  return updateObject(state, { market: !state.market });
};

const updateFancyExposure = (state, action) => {
  return updateObject(state, { fancy: !state.fancy });
};

const updateCurrentBets = (state, action) => {
  return updateObject(state, { currentBets: !state.currentBets });
};

const setBettingStatus = (state, action) => {
  return updateObject(state, { isBetting: true });
};

const resetBettingStatus = (state, action) => {
  return updateObject(state, { isBetting: false });
};

const resetMessage = (state, action) => {
  return updateObject(state, { message: !state.message });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_BALANCE:
      return updateBalance(state, action);
    case actionTypes.UPDATE_MARKET_EXPOSURE:
      return updateMarketExposure(state, action);
    case actionTypes.UPDATE_FANCY_EXPOSURE:
      return updateFancyExposure(state, action);
    case actionTypes.UPDATE_CURRENT_BETS:
      return updateCurrentBets(state, action);
    case actionTypes.SET_BETTING_STATUS:
      return setBettingStatus(state, action);
    case actionTypes.RESET_BETTING_STATUS:
      return resetBettingStatus(state, action);
    case actionTypes.RESET_MESSAGE:
      return resetMessage(state, action);
    default:
      return state;
  }
};

export default reducer;
