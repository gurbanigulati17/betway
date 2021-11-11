import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { useHistory } from "react-router-dom";

import Navigation from "./Navigation/Navigation";
import RightSection from "./RightSection/RightSection";
import Sidebar from "./Sidebar";
import withStyles from "../../styles";

import styles from "./User.styles";

const SidebarWithMobileTrigger = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const history = useHistory();

  useEffect(() => {
    history.listen(() => {
      setSidebarVisible(false);
    });
  }, [history]);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  return (
    <>
      <button onClick={toggleSidebar} className="trigger-open">
        <i className="fas fa-ellipsis-v"></i>
      </button>
      <div
        className={classnames(
          "sidebar",
          { "slide-in": isSidebarVisible },
          { "slide-out": !isSidebarVisible }
        )}
      >
        <button onClick={toggleSidebar} className="trigger-close">
          <i className="fas fa-times"></i>
        </button>
        <Sidebar />
      </div>
    </>
  );
};

const LayOut = ({ className }) => {
  return (
    <div className={classnames("user-layout", className)}>
      <Navigation />
      <div className="main-layout">
        <SidebarWithMobileTrigger />
        <main id="main">
          <RightSection />
        </main>
      </div>
    </div>
  );
};

export default withStyles(LayOut, styles);
