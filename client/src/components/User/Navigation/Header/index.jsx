import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../../../../assets/images/logo.png";

import withStyles from "../../../../styles";
import axios from "../../../../axios-instance/backendAPI";

import styles from "./styles";

const Header = ({ className, children }) => {
  const [user, setUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMainMenuVisible, setMainMenuVisibility] = useState(false);
  const [message, setMessage] = useState("");
  const updateBalance = useSelector((state) => state.update.balance);
  const messageUpdate = useSelector((state) => state.update.message);
  const history = useHistory();

  const toggleMainMenuVisibility = () =>
    setMainMenuVisibility(!isMainMenuVisible);

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
    history.listen(() => {
      setMainMenuVisibility(false);
    });
  }, [history]);

  useEffect(() => {
    axios
      .get("/user/info", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data[0]);
          setIsAdmin(res.data.data[0].username === "admin");
        } else if (res.data.password_changed) {
          setUser(res.data);
          setIsAdmin(res.data.username === "admin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history, updateBalance]);

  return (
    <div className={classnames("site-header", className)} id="header">
      <div className="site-header-wrapper">
        <div className="logo">
          <Link to="/dashboard">
            <img src={logo} alt="Lords Origional" width="130" />
          </Link>
        </div>

        <div className="nav-wrapper">
          <div className="menu-panel">
            <ul className="account-summary">
              {isAdmin ? (
                <>
                  <li>
                    <span className="summary-title">Chips_G : </span>
                    <span className="summary-data">{user.coins_generated}</span>
                  </li>
                  <li>
                    <span className="summary-title">Chips_W : </span>
                    <span className="summary-data">{user.coins_withdrawn}</span>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <span className="summary-title">Exposure : </span>
                    <span className="summary-data">{user.exposure}</span>
                  </li>
                  <li>
                    <span className="summary-title">Balance : </span>
                    <span className="summary-data">{user.balance}</span>
                  </li>
                </>
              )}
            </ul>
            <div className="main-memu">
              <button
                id="mainMenuTrigger"
                className="main-menu-trigger"
                onClick={toggleMainMenuVisibility}
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          <div className="message">
            <marquee speed={0.1}>{message}</marquee>
          </div>
        </div>
      </div>
      <div
        className={classnames("flyout-nav", {
          show: isMainMenuVisible,
        })}
      >
        <div className="username">
          <span>Welcome, {user.username}</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default withStyles(Header, styles);
