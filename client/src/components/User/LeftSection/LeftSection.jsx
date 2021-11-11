import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "../../../axios-instance/backendAPI";

export default function ControlledAccordions() {
  const history = useHistory();
  const classes = useStyles();
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
      .get("/user/getMatches", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
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

  return (
    <div className={classes.root}>
      <div className={classes.tab}>Sports</div>
      <div
        className={classes.inplay}
        onClick={() => {
          history.push("/inplay");
        }}
      >
        Inplay
      </div>
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
                          history.push("/fullmarket/" + data.matchId);
                          window.scrollTo(0, 0);
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
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: "98%",
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    flexBasis: "33.33%",
    flexShrink: 0,
    textAlign: "center",
    color: "#3f51b5",
    fontWeight: "bolder",
  },
  inplay: {
    color: "#3f51b5",
    fontWeight: "bolder",
    padding: "16px",
    cursor: "pointer",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
  },
  tab: {
    background: "linear-gradient( #000e2b , #016840)",
    height: "30px",
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  icon: {
    minWidth: "32px",
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
    },
  },
}));
