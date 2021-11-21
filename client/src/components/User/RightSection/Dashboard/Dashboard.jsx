import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";

import cricketB from "../../../../assets/icons/cricket-b.svg";
import cricketW from "../../../../assets/icons/cricket-w.svg";
import tennisB from "../../../../assets/icons/tennis-b.svg";
import tennisW from "../../../../assets/icons/tennis-w.svg";
import soccerB from "../../../../assets/icons/soccer-b.svg";
import soccerW from "../../../../assets/icons/soccer-w.svg";

import Event from "./Event/Event";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    paddingBottom: 0,
    [theme.breakpoints.down("sm")]: {
      paddingBottom: 0,
    },
  },
  tab: {
    background: "linear-gradient(#f60105 0,#801011 100%)",
    display: "flex",
  },
  tabBtn: {
    background: "linear-gradient(180deg, #2A3A43 27%, #1C282D 83%);",
    color: "#fff",
    borderRadius: "10px 10px 0 0",
    lineHeight: 1,
    fontSize: 12,
    padding: "7px 22px",
    border: 0,
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    "& .icon": {
      width: 25,
      height: 25,
      marginRight: 8,
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      background: "none",
      color: "#000",
      borderRadius: 0,
      padding: "8px 10px",
    },
  },
  activeTab: {
    background: "#dddcd6",
    color: "#2f353a",
    [theme.breakpoints.down("sm")]: {
      background: "linear-gradient(180deg,#2a3a43 27%,#1c282d 83%)",
      color: "#FFF",
    },
  },
  tabContent: {},
}));

let sports = [
  {
    id: "4",
    name: "cricket",
    title: "Cricket",
    icon: cricketB,
    activeIcon: cricketW,
  },
  {
    id: "1",
    name: "soccer",
    title: "Soccer",
    icon: soccerB,
    activeIcon: soccerW,
  },
  {
    id: "2",
    name: "tennis",
    title: "Tennis",
    icon: tennisB,
    activeIcon: tennisW,
  },
];

export default function Dashboard() {
  const classes = useStyles();
  const [activeTab, onChangeTab] = useState(sports[0].id);

  return (
    <div className={classes.dashboard}>
      <div className={classes.tab}>
        {sports.map((item) => (
          <button
            className={classnames(
              classes.tabBtn,
              activeTab === item.id && classes.activeTab
            )}
            onClick={() => onChangeTab(item.id)}
          >
            <span className="icon">
              <img src={activeTab === item.id ? item.activeIcon : item.icon} />
            </span>
            <span className="name">{item.title}</span>
          </button>
        ))}
      </div>
      <div className={classes.tabContent}>
        {activeTab === "4" && <Event id="4" isTitle={false} />}
        {activeTab === "1" && <Event id="1" isTitle={false} />}
        {activeTab === "2" && <Event id="2" isTitle={false} />}
      </div>
    </div>
  );
}
