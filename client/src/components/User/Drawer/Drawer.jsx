import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import RemoveIcon from "@material-ui/icons/Remove";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
const Accordion = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    fontWeight: "bold",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    "&$expanded": {
      margin: 0,
    },
  },
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
  },
}))(MuiAccordionDetails);
export default function DrawerLab() {

  const classes = useStyles();
  const [open, setopen] = useState(false);
  const notexpandtab = ["Users", "Report"];
  const [expanded, setExpanded] = useState(" ");
  const [minus, setMinus] = useState(" ");
  const history = useHistory();
  const username = useSelector((state) => state.auth.username);
  const usertype = useSelector((state) => state.auth.usertype);
  const [userlist, setUserlist] = useState([]);

  useEffect(() => {

    const my_usertype = parseFloat(usertype);
    const users = [
      { type: "seniorsuper", usertype: "2" },
      { type: "supermaster", usertype: "3" },
      { type: "master", usertype: "4" },
      { type: "client", usertype: "5" },
    ];
    const listuser = users.slice(my_usertype - 1);
    setUserlist(listuser);

  }, [usertype]);

  const handleChange = (panel) => (event, newExpanded) => {
    if (notexpandtab.includes(panel)) {
      setExpanded(newExpanded ? panel : false);
    }
    setMinus(newExpanded ? panel : false);
  };
  const toggleBar = () => {
    setopen(!open);
    setExpanded('')
  };
  const accountStatement = () => {
    history.push({
      pathname: "/accountStatement",
      search: "?username=" + username + "&usertype=" + usertype,
    });
    toggleBar();
  };

  const betHistory = () => {
    history.push('/bethistory')
    toggleBar();
  }

  const profitLoss = () => {
    history.push('/profitLoss')
    toggleBar();
  }

  const clientPL = () => {
    history.push('/clientPL')
    toggleBar();
  }

  const fancyStakes = () => {
    history.push('/fancyStakes')
    toggleBar();
  }

  const chipSummary = () => {
    history.push('/chipSummary')
    toggleBar();
  }

  const userPL = () => {
    history.push('/userPL')
    toggleBar();
  }

  const activity = () => {
    history.push('/activity')
    toggleBar();
  }

  let tablist;
  tablist = [
    "Dashboard",
    "Users",
    "Block Market",
    "In Play",
    "Running Market Analysis",
    "Report",
  ];

  if (usertype === "5") {
    tablist = ["Dashboard", "In Play", "Running Market Analysis", "Report"];
  }

  let reportList = [
    { name: "Account Statement", onCall: accountStatement },
    { name: "Chip Summary", onCall: chipSummary },
    { name: "Client P & L", onCall: clientPL },
    { name: "User P & L", onCall: userPL },
    { name: "Fancy Stakes", onCall: fancyStakes },
    { name: "Profit & Loss", onCall: profitLoss },
    { name: "Bet & History", onCall: betHistory },
  ];
  if (usertype === "5") {
    reportList = [
      { name: "Account Statement", onCall: accountStatement },
      { name: "Profit & Loss", onCall: profitLoss },
      { name: "Bet & History", onCall: betHistory },
    ];
  }

  if (usertype !== '1') {
    reportList.push({ name: 'Activity', onCall: activity })
  }

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleBar}
        edge="start"
        className={classes.btn}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleBar}>
        <div className={classes.list}>
          <div>
            {tablist.map((text, index) => (
              <div key={text}>
                <Accordion
                  expanded={expanded === text}
                  onChange={handleChange(text)}
                >
                  <AccordionSummary>
                    <div
                      onClick={() => {
                        if (text !== "Users" && text !== "Report") {
                          history.push(
                            "/" + text.split(" ").join("").toLowerCase()
                          );
                          toggleBar();
                        }
                      }}
                    >
                      {text}
                    </div>
                    {notexpandtab.includes(text) ? (
                      minus === text ? (
                        <RemoveIcon />
                      ) : (
                        <AddIcon />
                      )
                    ) : null}
                  </AccordionSummary>
                  <AccordionDetails>
                    {text === "Users"
                      ? userlist.map((user) => (
                        <div
                          className={classes.box}
                          key={user.type}
                          onClick={() => {
                            history.push("/userlist/" + user.usertype);
                            toggleBar();
                          }}
                        >
                          {user.type}
                        </div>
                      ))
                      : reportList.map((report) => (
                        <div
                          className={classes.box}
                          key={report.name}
                          onClick={report.onCall}
                        >
                          {report.name}
                        </div>
                      ))}
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    width: 250,
  },
  btn: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  box: {
    padding: "0.5em 1em",
    display: "block",
    background: "#018045",
    color: "white",
    textAlign: "center",
    margin: 0
  },
}));
