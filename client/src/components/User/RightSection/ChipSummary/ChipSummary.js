import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import axios from "../../../../axios-instance/backendAPI";
import Modal from "../../../UI/Modal/Modal";
import Settlement from "../UserList/Actions/Settlement";
import { useHistory } from "react-router-dom";

import appTheme from "../../../../styles/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  box: {
    display: "grid",
    gridTemplateColumns: "48% 4% 48%",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "auto",
    },
  },
  link: {
    color: "blue",
    cursor: "pointer",
  },
  back: {
    marginTop: 10,
    float: "right",
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
  container: {
    overflow: "auto",
    maxHeight: 440,
  },
  table: {
    overflow: "scroll",
    border: "solid 1px #bdc3c7",
    backgroundColor: "#FFFFFF",
    "& thead th": {
      padding: "6px 12px",
      color: "rgba(0,0,0,.54)",
      font: '600 12px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      backgroundColor: "#f5f7f7",
      position: "relative",
    },
    "& thead th::before": {
      borderRight: "1px solid rgba(189,195,199,.5)",
      content: "''",
      height: 16,
      marginTop: 8,
      position: "absolute",
      left: 0,
      textIndent: 2000,
      top: 0,
    },
    "& thead th:first-child::before": {
      content: "none",
    },
    "& tbody td": {
      font: '400 12px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      padding: "0 12px",
      color: "rgba(0,0,0)",
      lineHeight: "32px",
      borderBottom: "solid 1px #d9dcde",
    },
    "& tbody td p": {
      margin: 0,
    },
    "& tbody td button": {
      marginTop: "5px !important",
      marginBottom: "5px !important",
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
    justifyContent: "space-between",
  },
  title: {
    marginRight: "10px",
    fontSize: 14,
    fontFamily: "inherit",
    textTransform: "uppercase",
    fontWeight: 700,
  },
}));

export default function ChipSummary() {
  const classes = useStyles();
  const history = useHistory();
  const usertype = useSelector((state) => state.auth.usertype);
  const username = useSelector((state) => state.auth.username);
  const [userInfo, setUserInfo] = useState({ username: "", usertype: "" });
  const [allUsers, setAllUsers] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [settleInfo, setSettleInfo] = useState({});
  const [updateRows, setUpdateRows] = useState(false);
  const [open, setOpen] = useState(false);

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
      history.goBack();
    }
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

  const settlement = (uplink, downlink, chips) => {
    setOpen(true);
    setSettleInfo({
      uplink: uplink,
      downlink: downlink,
      chips: chips,
    });
  };

  const onClose = () => {
    setOpen(false);
  };

  const updateChips = () => {
    setUpdateRows((prevValue) => {
      return !prevValue;
    });
  };

  useEffect(() => {
    if (username && !userInfo.username.length) {
      myInfo();
    }
  }, [username]);

  useEffect(() => {
    if (userInfo.username.length) {
      axios
        .get("/user/chipSummary/" + userInfo.username, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((response) => {
          if (response.data.success) {
            setAllUsers(response.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userInfo, updateRows]);

  let plus = null,
    minus = null;

  if (allUsers.length) {
    plus = allUsers
      .filter((user) => user.winnings > 0)
      .map((user) => {
        return (
          <TableRow key={user.username}>
            <TableCell>{user.username}</TableCell>
            <TableCell>
              {user.usertype === userInfo.usertype ? (
                "Parent A/C"
              ) : (
                <span
                  onClick={() => {
                    ahead(user.username);
                  }}
                  className={classes.link}
                >
                  {user.username + " A/C"}
                </span>
              )}
            </TableCell>
            <TableCell>{user.winnings}</TableCell>
            <TableCell>
              {user.usertype === userInfo.usertype ? null : (
                <Button
                  variant="contained"
                  onClick={() => {
                    settlement(userInfo.username, user.username, user.winnings);
                  }}
                  className="btn btn-info"
                >
                  Settlement
                </Button>
              )}
            </TableCell>
          </TableRow>
        );
      });

    minus = allUsers
      .filter((user) => user.winnings <= 0)
      .map((user) => {
        return (
          <TableRow key={user.username}>
            <TableCell>{user.username}</TableCell>
            <TableCell>
              {user.usertype === userInfo.usertype ? (
                "Parent A/C"
              ) : (
                <span
                  onClick={() => {
                    ahead(user.username);
                  }}
                  className={classes.link}
                >
                  {user.username + " A/C"}
                </span>
              )}
            </TableCell>
            <TableCell>{user.winnings}</TableCell>
            <TableCell>
              {user.usertype === userInfo.usertype ? null : (
                <Button
                  variant="contained"
                  onClick={() => {
                    settlement(userInfo.username, user.username, user.winnings);
                  }}
                >
                  Settlement
                </Button>
              )}
            </TableCell>
          </TableRow>
        );
      });
  }

  return (
    <Paper className={classes.paper}>
      <div className={classes.titlePanel}>
        <span className={classes.title}>Chip Summary</span>
      </div>
      <div className={classes.root}>
        <Modal open={open} onClose={onClose}>
          <Settlement
            handleClose={onClose}
            updateRows={updateChips}
            uplink={settleInfo.uplink}
            downlink={settleInfo.downlink}
            chips={settleInfo.chips}
          />
        </Modal>
        <div className={classes.head}>
          <button
            className={`${classes.back} btn btn-danger`}
            onClick={() => {
              back();
            }}
          >
            Back
          </button>
        </div>
        <div className={classes.box}>
          <div>
            <h3>PLUS ACCOUNT(Dene ha)</h3>
            <TableContainer className={classes.container}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.heading}>Name</TableCell>
                    <TableCell className={classes.heading}>Account</TableCell>
                    <TableCell className={classes.heading}>Chips</TableCell>
                    <TableCell className={classes.heading}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{plus}</TableBody>
              </Table>
            </TableContainer>
          </div>
          <div></div>
          <div>
            <h3>MINUS ACCOUNT(Lene ha)</h3>
            <TableContainer className={classes.container}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.heading}>Name</TableCell>
                    <TableCell className={classes.heading}>Account</TableCell>
                    <TableCell className={classes.heading}>Chips</TableCell>
                    <TableCell className={classes.heading}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{minus}</TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </Paper>
  );
}
