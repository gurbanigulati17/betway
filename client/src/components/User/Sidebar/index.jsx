import React, { useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { useSelector } from "react-redux";

import withStyles from "../../../styles";
import axios from "../../../axios-instance/backendAPI";

import styles from "./styles";
import { sidebarItems } from "./config";
import SidebarNav from "./SidebarNav";

const Sidebar = ({
  className,
  isTitled = true,
  isExtraVisible = false,
  themed,
}) => {
  const [menuListApi, setMenuListApi] = useState([]);
  const username = useSelector((state) => state.auth.username);
  const usertype = useSelector((state) => state.auth.usertype);

  useEffect(() => {
    axios
      .get("/user/getMatches", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setMenuListApi(response.data.data || []);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const sidebarNav = useMemo(() => {
    const menuList = sidebarItems(username, usertype);
    const updatedMenus = menuList.map((menuItem) => {
      if (menuItem.type === "sports") {
        return {
          ...menuItem,
          items: menuItem.items.map((subItems) => {
            return {
              ...subItems,
              items: menuListApi
                .filter((apiItems) => apiItems.sport === subItems.type)
                .map((item) => ({
                  ...item,
                  href: `/fullmarket/${item.matchId}`,
                  icon: "link",
                })),
            };
          }),
        };
      }
      return { ...menuItem };
    });

    return updatedMenus;
  }, [menuListApi, username, usertype]);

  return (
    <aside className={classnames("sidebar-panel", className, themed)}>
      {sidebarNav.map((sidebarSection, index) => {
        return (
          <div className="sidebar-section" key={index.toString()}>
            {sidebarSection.title && isTitled && (
              <h3>{sidebarSection.title}</h3>
            )}
            <SidebarNav
              items={sidebarSection.items}
              isExtraVisible={isExtraVisible}
            />
          </div>
        );
      })}
    </aside>
  );
};

export default withStyles(Sidebar, styles);
