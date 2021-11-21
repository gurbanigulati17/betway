import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import ViewInfoDetail from "./ViewInfoDetail/ViewInfoDetail";
import appTheme from "../../../../../../styles/theme";

export default function ViewInfo(props) {
  const info = ["User", "Soccer", "Tennis", "Cricket", "Fancy", "Commission"];
  return (
    <>
      <div className="head">
        <h3>Account Information</h3>
      </div>
      <div className="body">
        {info.map((id, index) => {
          return (
            <ViewInfoDetail
              key={index}
              username={props.username}
              usertype={props.usertype}
              commission={props.commission}
              updateRows={props.updateRows}
              info={id}
              handleClose={props.handleClose}
            />
          );
        })}
      </div>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    backgroundColor: "#f5f5f5",
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      margin: -10,
      width: "initial",
      padding: 20,
    },
  },
  titlePanel: {
    background: appTheme.colors.primary,
    color: appTheme.colors.textLight,
    fontWeight: 700,
    border: 0,
    margin: "-10px -10px 0 -10px",
    minHeight: 1,
    padding: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    marginRight: "10px",
    fontSize: 14,
    fontFamily: "inherit",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  viewWrapper: {
    overflow: "auto",
    maxHeight: 650,
  },
}));
