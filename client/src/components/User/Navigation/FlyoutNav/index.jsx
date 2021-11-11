import classnames from "classnames";

import TabBar from "../TabBar/TabBar";
import styles from "./styles";

import withStyles from "../../../../styles";

const FlyoutNav = ({ isMainMenuVisible, username, className }) => {
  return (
    <div
      className={classnames(className, {
        show: isMainMenuVisible,
      })}
    >
      <div className="username">
        <span>Welcome, {username}</span>
      </div>
      <TabBar />
    </div>
  );
};

export default withStyles(FlyoutNav, styles);
