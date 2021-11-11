import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import CurrentBets from "./CurrentBets/CurrentBets";
import axios from "../../../../../axios-instance/backendAPI";
import MarketAnalysis from "./MarketAnalysis/MarketAnalysis";
import { useSelector } from "react-redux";
import Modal from "../../../../UI/Modal/Modal";
import StakeValues from "./StakeValues/StakeValues";

import appTheme from "../../../../../styles/theme";
import { pxToRem } from "../../../../../styles/utils";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function BetSlip(props) {
  const username = useSelector((state) => state.auth.username);
  const usertype = useSelector((state) => state.auth.usertype);
  const [no_of_bets, setNo_of_bets] = useState(0);
  const [no_of_fancy_bets, setNo_of_fancy_bets] = useState(0);
  const ref = useRef(false);

  const useStyles = makeStyles((theme) => ({
    head: {
      display: "flex",
      alignItems: "center",
      fontSize: pxToRem(14),
      borderRadius: 0,
      overflow: "hidden",
      position: "relative",
      backgroundColor: appTheme.colors.textLight,
      backgroundImage: `linear-gradient(
        to right,
        ${appTheme.colors.primaryDark},
        ${appTheme.colors.primary},
        ${appTheme.colors.primaryDark}
      )`,
      color: appTheme.colors.textLight,
      padding: 10,
      justifyContent: "space-between",
      marginBottom: 10,
      border: "solid 1px #ddd",
      textTransform: "uppercase",
    },
    root: {
      width: "98%",
      margin: "0 auto",
      paddingLeft: "10px",
      [theme.breakpoints.down("sm")]: {
        display: props.display,
        width: "100%",
        margin: "0 auto 15px",
        padding: "0px",
        ...(props.isMobileHidden ? { display: "none" } : {}),
      },
    },
    edit: {
      cursor: "pointer",
    },
    tabs: {
      background: appTheme.colors.primaryDark,
      color: appTheme.colors.textLight,
    },
    active: {
      fontWeight: "700",
      background: appTheme.colors.textLight,
      color: appTheme.colors.text,
      border: "0",
    },
    betSlip: {
      "& .MuiAppBar-root": {
        backgroundColor: "transparent",
      },
      "& .MuiAppBar-root > div": {
        backgroundColor: "transparent",
      },
      "& .MuiTabs-indicator": {
        backgroundColor: appTheme.colors.primaryDark,
      },
      "& .MuiTabs-flexContainer > button": {
        backgroundColor: appTheme.colors.primaryDark,
        color: appTheme.colors.textLight,
        borderRadius: "8px 8px 0 0",
        border: "solid 1px #838181",
      },
      "& .MuiTabs-flexContainer > button.Mui-selected": {
        border: "solid 1px #DDDDDD",
      },
    },
  }));

  const classes = useStyles();
  const location = useLocation();
  const [userHistory, setUserHistory] = useState([]);
  const [userInfo, setUserInfo] = useState({ username: "", usertype: "" });
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = useState(false);

  const handleNoOfBets = (number) => {
    setNo_of_bets(number);
  };

  const handleNoOfFancyBets = (number) => {
    setNo_of_fancy_bets(number);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ahead = (username) => {
    if (userInfo.usertype !== "4") {
      let users = [...userHistory];
      users.push(username);
      setUserHistory(users);
      getUserInfo(username);
    }
  };

  const back = () => {
    if (userHistory.length !== 1) {
      const users = [...userHistory];
      users.pop();
      getUserInfo(users[users.length - 1]);
      setUserHistory([...users]);
    } else {
      myInfo();
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const getUserInfo = (username) => {
    axios
      .get("/user/userBalanceInfo/" + username, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          const user = {
            username: response.data.data[0].username,
            usertype: response.data.data[0].usertype,
          };
          setUserInfo(user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const myInfo = () => {
    const user = {
      username: username,
      usertype: usertype,
    };
    setUserInfo(user);

    const cur_user = [];
    cur_user.push(username);
    setUserHistory(cur_user);
  };

  useEffect(() => {
    myInfo();
  }, [username, props.marketId]);

  useEffect(() => {
    if (ref.current) {
      handleChange(null, 2);
    }
    ref.current = true;
  }, [props.flag]);

  let toRender = null;
  if (location.pathname.includes("fullmarket")) {
    toRender = (
      <div className={classes.betSlip}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            className={classes.tabs}
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab
              label={"All Bets(" + no_of_bets + ")"}
              {...a11yProps(0)}
              className={value === 0 ? classes.active : classes.inactive}
            />
            <Tab
              label={
                no_of_fancy_bets
                  ? "Fancy Bets(" + no_of_fancy_bets + ")"
                  : "Fancy Bets"
              }
              {...a11yProps(0)}
              className={value === 1 ? classes.active : classes.inactive}
            />
            {usertype !== "5" ? (
              <Tab
                label="Current Position"
                {...a11yProps(1)}
                className={value === 2 ? classes.active : classes.inactive}
              />
            ) : null}
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} className={classes.myTab}>
          <CurrentBets
            eventId={props.eventId}
            myUsertype={usertype}
            handleNoOfBets={handleNoOfBets}
          />
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.myTab}>
          <CurrentBets
            eventId={props.eventId}
            myUsertype={usertype}
            handleNoOfBets={handleNoOfFancyBets}
            type="fancy"
          />
        </TabPanel>
        {usertype !== "5" ? (
          <TabPanel value={value} index={2} className={classes.myTab}>
            <MarketAnalysis
              eventId={props.eventId}
              marketId={props.marketId}
              username={userInfo.username}
              usertype={userInfo.usertype}
              ahead={ahead}
              back={back}
            />
          </TabPanel>
        ) : null}
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Modal open={open} onClose={onClose}>
        <StakeValues
          onClose={onClose}
          changeStakeChanged={props.changeStakeChanged}
        />
      </Modal>
      <div className={classes.head}>
        <div style={{ fontWeight: 700 }}>Bet Slip</div>
        <div
          className={classes.edit}
          onClick={() => {
            if (usertype === "5") {
              setOpen(true);
            }
          }}
        >
          <i className="far fa-edit"></i> Edit Stakes
        </div>
      </div>
      {toRender}
    </div>
  );
}
