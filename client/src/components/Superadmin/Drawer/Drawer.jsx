import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useHistory } from "react-router-dom";
import axios from "../../../axios-instance/backendAPI";

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
  const history = useHistory();
  const [expanded, setExpanded] = React.useState(false);
  const [sportList, setSportList] = useState([]);

  let sport = [
    { type: "4", name: "Cricket" },
    { type: "1", name: "Soccer" },
    { type: "2", name: "Tennis" },
  ];
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(() => {

    axios
      .get("/superadmin/getAllMatches", {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        if (response.data.success) {
          setSportList(response.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const toggleBar = () => {
    setopen(!open);
    setExpanded('')
  };

  return (
    <div>
      <IconButton
        aria-label="open drawer"
        onClick={toggleBar}
        edge="start"
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleBar}>
        <div className={classes.root}>
          <div className={classes.tab}>Sports</div>
          {sport.map((sport) => {
            return (
              <Accordion
                key={sport.type}
                expanded={expanded === sport.name}
                onChange={handleChange(sport.name)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography className={classes.heading}>{sport.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List component="nav">
                    {sportList
                      .filter((data) => data.sport === sport.type)
                      .map((data) => {
                        return (
                          <ListItem
                            button
                            key={data.matchId}
                            className={classes.item}
                            onClick={() => {
                              history.push("/superadmin/fullmarket/" + data.matchId);
                              toggleBar()
                            }}
                          >
                            <i className="fas fa-angle-double-right"></i>
                            <ListItemText
                              primary={data.matchName}
                              className={classes.listText}
                            />
                          </ListItem>
                        );
                      })}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  tab: {
    backgroundColor: "#4096cf",
    height: "30px",
    color: "white",
    textAlign: "center",
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    flexBasis: "33.33%",
    flexShrink: 0,
    textAlign: "center",
    color: "#3f51b5",
    fontWeight: "bolder",
  },
  item: {
    padding: "0",
    margin: "0",
    fontSize: "10px",
  },
  listText: {
    "& span, & svg": {
      fontSize: "0.85rem",
      display: "flex",
      alignItems: "start",
    }
  }
}));
