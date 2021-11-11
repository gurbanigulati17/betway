import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  AppBar,
  Toolbar,
  Grow,
  Popper,
  Paper,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Avatar,
  ButtonGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DrawerLab from "../../Drawer/Drawer";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../../axios-instance/backendAPI";
import * as actions from "../../../../store/actions/index";
import Modal from "../../../UI/Modal/Modal";
import Exposure from "./Exposure/Exposure";
import logo from "../../../../assets/images/logo.png";

export default function Navbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [username, setusername] = useState("");
  const [usertype, setUsertype] = useState("");
  const [balance, setBalance] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [generated, setGenerated] = useState(0);
  const [withdrawn, setWithdrawn] = useState(0);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const updateBalance = useSelector((state) => state.update.balance);
  const messageUpdate = useSelector((state) => state.update.message);
  const anchorRef = React.useRef(null);
  const history = useHistory();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const onClose = () => {
    setShow(false);
  };
  const getMessage = () => {
    axios
      .get("/user/getMessage", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getMessage();
  }, [messageUpdate]);

  useEffect(() => {
    axios
      .get("/user/info", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.success) {
          setusername(res.data.data[0].username);
          setUsertype(res.data.data[0].usertype);

          if (res.data.data[0].username.toLowerCase() === "admin") {
            setGenerated(res.data.data[0].coins_generated);
            setWithdrawn(res.data.data[0].coins_withdrawn);
          } else {
            setExposure(res.data.data[0].exposure);
            setBalance(res.data.data[0].balance);
          }
        } else if (res.data.password_changed) {
          setusername(res.data.username);
          setUsertype(res.data.usertype);
          setExposure(res.data.exposure);
          setBalance(res.data.balance);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history, updateBalance]);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  return (
    <div className={classes.root}>
      <Modal open={show} onClose={onClose}>
        <Exposure />
      </Modal>
      <AppBar position="fixed" className={classes.AppBar}>
        <Toolbar className={classes.toolbar} color="inherit">
          <Grid item sm={12} xs={12} className={classes.container}>
            <Toolbar className={classes.tool}>
              <DrawerLab />
              <Grid>
                <div className={classes.mainLogo}>
                  <Avatar
                    src={logo}
                    className={classes.avatar}
                    onClick={() => {
                      history.push("/dashboard");
                    }}
                  />
                </div>
              </Grid>
              <Grid className={classes.grow}>
                <div className={classes.marquee}>
                  <marquee speed={0.1}>{message}</marquee>
                </div>
              </Grid>

              {username.toLowerCase() === "admin" ? (
                <ButtonGroup
                  variant="outlined"
                  orientation="vertical"
                  className={classes.Button}
                >
                  <Button className={classes.btn}>
                    <span className={classes.innerBox}>
                      <span className={classes.main}>Chips_G:</span>
                      <span className={classes.coins}>{generated}</span>
                    </span>
                  </Button>
                  <Button className={classes.btn}>
                    <span className={classes.innerBox}>
                      <span className={classes.expo}>Chips_W:</span>
                      <span className={classes.coins}>{withdrawn}</span>
                    </span>
                  </Button>
                </ButtonGroup>
              ) : (
                <ButtonGroup
                  variant="outlined"
                  orientation="vertical"
                  className={classes.Button}
                >
                  <Button className={classes.btn}>
                    <span className={classes.innerBox}>
                      <span className={classes.main}>Main:</span>
                      <span className={classes.coins}>{balance}</span>
                    </span>
                  </Button>
                  <Button
                    className={classes.btn}
                    onClick={() => {
                      if (usertype === "5") {
                        setShow(true);
                      }
                    }}
                  >
                    <span className={classes.innerBox}>
                      <span className={classes.expo}>Exposure:</span>
                      <span className={classes.coins}>{exposure}</span>
                    </span>
                  </Button>
                </ButtonGroup>
              )}
              <Button
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className={classes.username}
              >
                {username}
              </Button>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={1}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          className={classes.menu}
                          autoFocusItem={open}
                          id="menu-list-grow"
                        >
                          <MenuItem
                            onClick={() => {
                              history.push("/changePassword");
                              handleToggle();
                            }}
                          >
                            <i className="fas fa-key"></i>&nbsp;Change Password
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              dispatch(actions.logout());
                            }}
                          >
                            <i className="fas fa-sign-out-alt"></i>&nbsp;Logout
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Toolbar>
          </Grid>
        </Toolbar>
        <div className={classes.mobileMarquee}>
          <span
            style={{
              fontSize: "1.5em",
              color: "white",
              cursor: "pointer",
              background: "#303030",
              padding: "0 4px",
            }}
            onClick={() => {
              history.push("/dashboard");
            }}
          >
            <i className="fas fa-home"></i>
          </span>
          <marquee speed={0.1}>{message}</marquee>
        </div>
      </AppBar>
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  AppBar: {
    background: "linear-gradient( #000e2b , #016840)",
  },
  marquee: {
    width: "350px",
    height: "30px",
    display: "flex",
    color: "black",
    alignItems: "center",
    border: "1px solid black",
    backgroundColor: "#fff",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  mobileMarquee: {
    width: "100%",
    height: "30px",
    display: "flex",
    alignItems: "center",
    border: "1px solid black",
    backgroundColor: "#fff",
    color: "black",
    zIndex: "-1",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    [theme.breakpoints.down("sm")]: {
      padding: "0px",
    },
  },
  container: {
    width: "100%",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      minHeight: "37px",
    },
  },
  title: {
    flexGrow: 1,
    alignSelf: "flex-end",
  },
  mainLogo: {
    color: "#a1a1a1",
    justifyContent: "left",
    width: "100%",
  },
  avatar: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    width: "150px",
    height: "100px",
    borderRadius: 0,
    cursor: "pointer",
  },
  buttonFontSize: {
    fontSize: "11px",
    color: "#a1a1a1",
  },

  Button: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.80rem",
      textTransform: "none",
      display: "flex",
      flexDirection: "row",
      border: "none",
    },
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    border: "1px solid black",
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  btn: {
    fontWeight: "700",
    [theme.breakpoints.down("sm")]: {
      border: "none",
      textTransform: "none",
      display: "flex",
      flexDirection: "column",
    },
  },
  innerBox: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  main: {
    color: "#12c758",
  },
  expo: {
    color: "#f70c0c",
  },
  coins: {
    color: "white",
  },
  username: {
    fontWeight: "700",
    color: "white",
  },
  appBar: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      position: "fixed",
      top: "50px",
      backgroundColor: "#fff",
      borderTop: "1px solid black",
      minHeight: "30px",
    },
  },
  tool: {
    minHeight: "30px",
    color: "white",
  },
  menu: {
    zIndex: "10",
  },
}));
