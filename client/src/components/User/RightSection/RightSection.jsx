import React, { useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import UserList from "./UserList/UserList";
import ChildList from "./ChildList/Childlist";
import Dashboard from "./Dashboard/Dashboard";
import Logout from "../../Logout/Logout";
import ChangePassword from "./ChangePassword/ChangePassword";
import AccountStatement from "./UserList/Actions/AccountStatement";
import RunningMarketAnalysis from "./RunningMarketAnalysis/RunningMarketAnalysis";
import Inplay from "./Inplay/Inplay";
import BetSlip from "./Fullmarket/BetSlip/BetSlip";
import FullMarket from "./Fullmarket/Fullmarket";
import BetHistory from "./BetHistory/BetHistory";
import ExposureBets from "./ExposureBets/ExposureBets";
import BlockMarket from "./BlockMarket/BlockMarket";
import BlockMarketEvents from "./BlockMarket/BlockMarketEvents";
import BlockMarketSettings from "./BlockMarket/BlockMarketSettings";
import ProfitLoss from "./ProfitLoss/ProfitLoss";
import UserProfitLoss from "./UserList/Actions/ProfitLoss";
import ClientPL from "./ClientPL/ClientPl";
import MarketReport from "./MarketReport/MarketReport";
import UserPL from "./UserPL/UserPL";
import Activity from "./Activity/Activity";
import FancyStakes from "./FancyStakes/FancyStakes";
import ChipSummary from "./ChipSummary/ChipSummary";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/actions/index";
import UserActivity from "./UserList/Actions/UserActivity";
import Slider from "../Slider";
import Message from "../Message";
import Account from "../RightSection/Accounts";
import Footer from "../../User/Footer";

const useStyles = makeStyles((theme) => ({
  contab: {
    width: "100%",
    margin: "0 auto",
    padding: "0 10px",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      padding: "0",
    },
  },
  columns: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  columnLeft: {
    width: "65%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  columnRight: {
    width: "35%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const RightSection = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const isAuthenticated = token !== null;
  const authRedirectPath = useSelector((state) => state.auth.authRedirectPath);

  useEffect(() => {
    dispatch(actions.authCheckState());
  });

  let secure = (
    <Switch>
      <Route
        exact
        path="/dashboard"
        render={() => {
          return (
            <div className={classes.root}>
              <div className={classes.columns}>
                <div className={classes.columnLeft}>
                  <Message />
                  <Slider />
                  <Dashboard />
                  <Footer />
                </div>
                <div className={classes.columnRight}>
                  <BetSlip isMobileHidden />
                </div>
              </div>
            </div>
          );
        }}
      />
      <Route
        exact
        path="/inplay"
        render={() => {
          return (
            <div className={classes.root}>
              <div className={classes.columns}>
                <div className={classes.columnLeft}>
                  <Inplay />
                </div>
                <div className={classes.columnRight}>
                  <BetSlip isMobileHidden />
                </div>
              </div>
            </div>
          );
        }}
      />
      <Route path="/account" component={Account} />
      <Route exact path="/fullmarket/:matchId" component={FullMarket} />
      <Route path="/blockMarket" component={BlockMarket} exact />
      <Route
        path="/blockMarket/:eventType"
        component={BlockMarketEvents}
        exact
      />
      <Route
        path="/blockMarket/:eventType/setting"
        component={BlockMarketSettings}
        exact
      />
      <Route path="/runningMarketAnalysis" component={RunningMarketAnalysis} />
      <Route path="/logout" component={Logout} />
      <Route path="/fancyStakes" component={FancyStakes} />
      <Route path="/clientPL" component={ClientPL} />
      <Route path="/userPL" component={UserPL} />
      <Route path="/activity" component={Activity} />
      <Route path="/profitLoss" component={ProfitLoss} />
      <Route path="/marketReport" component={MarketReport} />
      <Route path="/chipSummary" component={ChipSummary} />
      <Route path="/bethistory" component={BetHistory} />
      <Route path="/userProfitLoss/:username" component={UserProfitLoss} />
      <Route path="/userlist/:usertype" component={UserList} />
      <Route path="/childlist/:username" component={ChildList} />
      <Route path="/expoBets/:username" component={ExposureBets} />
      <Route path="/changePassword" component={ChangePassword} />
      <Route path="/accountStatement" component={AccountStatement} />
      <Route path="/userActivity/:username" component={UserActivity} />
      <Redirect from="/" to="/dashboard" />
      <Route
        render={() => {
          return (
            <div style={{ textAlign: "center" }}>
              <h1>Error 404</h1>
              <p> Page Not Found!</p>
            </div>
          );
        }}
      />
    </Switch>
  );

  if (!isAuthenticated) return <Redirect to={authRedirectPath} />;

  if (
    localStorage.getItem("pc") &&
    history.location.pathname !== "/changePassword"
  ) {
    history.push("/changePassword");
  }

  return <div className={classes.contab}>{secure}</div>;
};

export default RightSection;
