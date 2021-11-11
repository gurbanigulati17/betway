import React, { useState, useEffect, useRef } from "react";
import Navigation from "./Navigation/Navigation";
import { Route, Switch, Redirect } from "react-router-dom";
import Series from "./AllSeries/AllSeries";
import Matches from "./Matches/Matches";
import Market from "./Matches/Market/Market";
import Settle from "./Settle/Settle";
import Message from "./Message/Message";
import CreateAdmin from "./CreateAdmin/CreateAdmin";
import CurrentBets from "./CurrentBets/CurrentBets";
import FullMarket from "./Market/Market";
import BetSlip from "./Market/BetSlip/BetSlip";
import MatchHistory from "./MatchHistory/MatchHistory";
import { makeStyles } from "@material-ui/core/styles";
import ChangePassword from "./ChangePassword/ChangePassword";

const useStyles = makeStyles((theme) => ({
  root: {
    top: "120px",
    position: "relative",
    display: "grid",
    gridTemplateColumns: "60% 40%",
    margin: "0 3px",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "100% 0%",
    },
  },
}));

const Superadmin = (props) => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("a_token") !== null);
    return () => {
      _isMounted.current = false;
    };
  }, []);

  let secure = (
    <Switch>
      <Route path={props.match.url} exact component={Settle} />
      <Route
        path={props.match.url + "/registerAdmin"}
        exact
        component={CreateAdmin}
      />
      <Route path={props.match.url + "/message"} component={Message} />
      <Route path={props.match.url + "/curBets"} component={CurrentBets} />
      <Route
        path={props.match.url + "/matchHistory"}
        component={MatchHistory}
      />
      <Route
        path={props.match.url + "/changePassword"}
        component={ChangePassword}
      />
      <Route path={props.match.url + "/series"} component={Series} />
      <Route path={props.match.url + "/matches"} component={Matches} />
      <Route path={props.match.url + "/market/:id"} component={Market} />
      <Route
        path={props.match.url + "/fullmarket/:matchId"}
        render={() => {
          return (
            <div className={classes.root}>
              <div>
                <FullMarket />
              </div>
              <div>
                <BetSlip />
              </div>
            </div>
          );
        }}
      />
    </Switch>
  );
  if (!isAuthenticated) {
    secure = <Redirect to={props.match.url + "/login"} />;
  }
  return (
    <>
      <Navigation match={props.match} />
      {secure}
    </>
  );
};

export default Superadmin;
