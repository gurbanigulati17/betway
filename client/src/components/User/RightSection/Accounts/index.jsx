import React from "react";
import { useSelector } from "react-redux";

import TabBar from "../../Navigation/TabBar/TabBar";

import withStyles from "../../../../styles";

import styles from "./style";

const Account = ({ className }) => {
  const user = useSelector((state) => state.auth);

  return (
    <div className={`account ${className}`}>
      <div className="username">
        <i className="fa fa-user"></i>
        <span style={{ marginLeft: 8 }}>Welcome, {user.username}</span>
      </div>
      <TabBar />
    </div>
  );
};

export default withStyles(Account, styles);
