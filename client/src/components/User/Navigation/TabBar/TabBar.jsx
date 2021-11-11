import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import withStyles from "../../../../styles";
import * as actions from "../../../../store/actions";

import tabBarConfig from "./TabBar.config";
import styles from "./TabBar.styles";

const isRouteActive = (pathname, item) => {
  if (pathname === item.href || item.href?.indexOf(pathname) === 0) {
    return true;
  }

  if (item.items && item.items?.length) {
    return item.items.some(
      (item) => pathname === item.href || item.href?.indexOf(pathname) === 0
    );
  }
};

const MenuList = ({ menu, onLogout }) => {
  const [isChildVisible, setChildVisibility] = useState([]);
  const history = useHistory();
  //assigning location variable
  const location = useLocation();

  useEffect(() => {
    history.listen(() => {
      setChildVisibility([]);
    });
  }, [history]);

  const toggleChild = (index) => {
    const isExist = isChildVisible.includes(index);
    if (isExist) {
      const newItems = isChildVisible.filter((item) => item !== index);
      setChildVisibility(newItems);
    } else {
      setChildVisibility([...isChildVisible, index]);
    }
  };

  if (!menu || !menu.length) {
    return null;
  }

  //destructuring pathname from location
  const { pathname } = location;

  return (
    <ul>
      {menu.map((item, index) => {
        return (
          <li
            key={index.toString()}
            className={classnames({
              active: isRouteActive(pathname, item),
            })}
          >
            {item.href ? (
              <Link className={classnames("nav-link")} to={item.href}>
                {item.icon && (
                  <span className="icon">
                    <i className={`fas fa-${item.icon}`}></i>
                  </span>
                )}
                <span className="label">{item.name}</span>
              </Link>
            ) : (
              <button className="nav-link" onClick={() => toggleChild(index)}>
                {item.icon && (
                  <span className="icon">
                    <i className={`fas fa-${item.icon}`}></i>
                  </span>
                )}
                <span className="label">{item.name}</span>
                {item.items && item.items.length && (
                  <span className="chevron-b">
                    <i
                      className={classnames(
                        "fas",
                        isChildVisible.includes(index)
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      )}
                    ></i>
                  </span>
                )}
              </button>
            )}
            {item.items &&
              item.items.length &&
              (isChildVisible.includes(index) ||
                isRouteActive(pathname, item)) && (
                <MenuList menu={item.items} />
              )}
          </li>
        );
      })}
      {onLogout && (
        <li>
          <button className="nav-link" onClick={onLogout}>
            <span className="icon">
              <i className="fas fa-sign-out-alt"></i>
            </span>
            <span className="label">Logout</span>
          </button>
        </li>
      )}
    </ul>
  );
};

const SimpleTabs = ({ className }) => {
  const [menuList, setMenuList] = useState([]);
  const username = useSelector((state) => state.auth.username);
  const usertype = useSelector((state) => state.auth.usertype);
  const dispatch = useDispatch();

  useEffect(() => {
    const config = tabBarConfig(username, usertype);
    setMenuList(config);
  }, [usertype, username]);

  const onLogout = useCallback(() => {
    dispatch(actions.logout());
  }, []);

  return (
    <nav className={classnames("tab-bar", className)}>
      <MenuList menu={menuList} onLogout={onLogout} />
    </nav>
  );
};

export default withStyles(SimpleTabs, styles);
