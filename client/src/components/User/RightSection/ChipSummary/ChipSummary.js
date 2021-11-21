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
} from "@material-ui/core";
import { useSelector } from "react-redux";
import axios from "../../../../axios-instance/backendAPI";
import Modal from "../../../UI/Modal/Modal";
import Settlement from "../UserList/Actions/Settlement";
import { useHistory } from "react-router-dom";
import { sectionStyle } from "../../../../utils/common.style";

const useStyles = makeStyles(sectionStyle);

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
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    settlement(userInfo.username, user.username, user.winnings);
                  }}
                >
                  Settlement
                </button>
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
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    settlement(userInfo.username, user.username, user.winnings);
                  }}
                >
                  Settlement
                </button>
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
        <div className={classes.backWrapper}>
          <button
            className={`${classes.back} btn btn-primary`}
            onClick={() => {
              back();
            }}
          >
            Back
          </button>
        </div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>PLUS ACCOUNT(Dene ha)</h3>
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
        <div>
          <h3 style={{ marginTop: 0 }}>MINUS ACCOUNT(Lene ha)</h3>
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
    </Paper>
  );
}
