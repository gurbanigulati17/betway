import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import classnames from "classnames";

import withStyles from "../../../../styles";

import styles from "./style";

const USER_NAV = [
  {
    name: "Bets",
    href: "/bethistory",
    icon: "coins",
  },
  {
    name: "In-Play",
    href: "/inplay",
    icon: "stopwatch",
  },
  {
    name: "Home",
    href: "/dashboard",
    icon: "home",
  },
  {
    name: "Analysis",
    href: "/runningMarketAnalysis",
    icon: "chart-line",
  },
  {
    name: "Account",
    href: "/account",
    icon: "user-circle",
  },
];

const ADMIN_NAV = [
  {
    name: "Bets",
    href: "/bethistory",
    icon: "coins",
  },
  {
    name: "In-Play",
    href: "/inplay",
    icon: "stopwatch",
  },
  {
    name: "Home",
    href: "/dashboard",
    icon: "home",
  },
  {
    name: "Users",
    href: "",
    icon: "user-circle",
    type: "user",
  },
  {
    name: "Account",
    href: "/account",
    icon: "user-circle",
  },
];

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

const MobileNav = ({ className }) => {
  const usertype = useSelector((state) => state.auth.usertype);

  //assigning location variable
  const location = useLocation();

  if (!usertype) return null;

  let menu = usertype === "5" ? USER_NAV : ADMIN_NAV;

  //destructuring pathname from location
  const { pathname } = location;

  if (usertype !== "5") {
    menu = menu.map((item) => {
      if (item.type === "user") {
        return { ...item, href: `/userlist/${Number(usertype) + 1}` };
      }
      return item;
    });
  }

  return (
    <nav className={className}>
      <ul>
        {menu.map((item, index) => (
          <li key={index}>
            <Link
              to={item.href}
              className={classnames({ active: isRouteActive(pathname, item) })}
            >
              <i className={`fa fa-${item.icon}`}></i>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default withStyles(MobileNav, styles);
