import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";

const isRouteActive = (pathname, item) => {
  if (pathname === item.href || item.href?.indexOf(pathname) === 0) {
    return true;
  }
};

const SidebarNav = ({ items, className = "" }) => {
  const [activeChild, setVisibility] = useState(null);

  const history = useHistory();
  //assigning location variable
  const location = useLocation();

  useEffect(() => {
    history.listen(() => {
      setVisibility(null);
    });
  }, [history]);

  //destructuring pathname from location
  const { pathname } = location;

  const toggle = (name) =>
    setVisibility((prev) => (prev === name ? null : name));

  if (!items || !items.length) {
    return null;
  }

  return (
    <ul className={className}>
      {items.map((menuItem, index) => {
        const isActive =
          activeChild === menuItem.name || activeChild === menuItem.matchName;

        return (
          <li key={index.toString()}>
            {menuItem.href ? (
              <Link
                to={menuItem.href}
                className={classNames("nav-link", {
                  active: isActive || isRouteActive(pathname, menuItem),
                })}
              >
                <span className="name">
                  {menuItem.icon && (
                    <span className="icon">
                      <i className={`fa fa-${menuItem.icon}`}></i>
                    </span>
                  )}
                  <span className="text">
                    {menuItem.name || menuItem.matchName}
                  </span>
                </span>
                {!!menuItem?.items?.length && (
                  <span className="chevron">
                    <i className="fa fa-chevron-left"></i>
                  </span>
                )}
              </Link>
            ) : (
              <button
                className={classNames("nav-link", {
                  active: isActive || isRouteActive(pathname, menuItem),
                })}
                onClick={() => toggle(menuItem.name || menuItem.matchName)}
              >
                <span className="name">
                  {menuItem.icon && (
                    <span className="icon">
                      <i className={`fa fa-${menuItem.icon}`}></i>
                    </span>
                  )}
                  <span className="text">
                    {menuItem.name || menuItem.matchName}
                  </span>
                </span>
                {!!menuItem?.items?.length && (
                  <span className="chevron">
                    <i className="fa fa-chevron-left"></i>
                  </span>
                )}
              </button>
            )}
            {
              <SidebarNav
                items={menuItem.items}
                className={classNames(
                  isActive || isRouteActive(pathname, menuItem)
                    ? "show"
                    : "hide"
                )}
              />
            }
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarNav;
