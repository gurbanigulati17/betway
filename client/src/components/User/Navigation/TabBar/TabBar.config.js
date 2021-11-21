const tabBarConfig = (username, usertype) => {
  const users = [
    {
      type: "seniorsuper",
      usertype: "2",
      name: "Senior super",
      href: "/userlist/2",
    },
    {
      type: "supermaster",
      usertype: "3",
      name: "Super master",
      href: "/userlist/3",
    },
    {
      type: "master",
      usertype: "4",
      name: "Master",
      href: "/userlist/4",
    },
    {
      type: "client",
      usertype: "5",
      name: "Client",
      href: "/userlist/5",
    },
  ];
  const listuser = users.slice(parseFloat(usertype) - 1);

  let reportlist = [
    {
      name: "Account Statement",
      href: `/accountStatement?username=${username} &usertype=${usertype}`,
    },
    { name: "Chip Summary", href: "/chipSummary" },
    { name: "Client P & L", href: "/clientPL" },
    { name: "User P & L", href: "/userPL" },
    { name: "Fancy Stakes", href: "/fancyStakes" },
    { name: "Profit & Loss", href: "/profitLoss" },
    { name: "Bet & History", href: "/bethistory" },
  ];

  if (usertype === "5") {
    reportlist = [
      {
        name: "Account Statement",
        href: `/accountStatement?username=${username} &usertype=${usertype}`,
      },
      { name: "Profit & Loss", href: "/profitLoss" },
      { name: "Bet & History", href: "/bethistory" },
    ];
  }

  if (usertype !== "1") {
    reportlist.push({
      name: "Activity",
      href: "/activity",
    });
  }

  let listItmes = [
    {
      name: "Dashboard",
      type: "dashboard",
      href: "/dashboard",
    },
    {
      name: "In-Play",
      type: "inplay",
      href: "/inplay",
    },
    {
      name: "Users",
      type: "users",
      items: listuser,
    },
    {
      name: "Block Market",
      type: "blockMarket",
      href: "/blockMarket",
    },
    {
      name: "Running Market Analysis",
      type: "runningMarketAnalysis",
      href: "/runningMarketAnalysis",
    },
    {
      name: "Report",
      type: "report",
      items: reportlist,
    },
    {
      name: "Change password",
      type: "changePassword",
      href: "/changePassword",
    },
  ];

  if (usertype === "5") {
    listItmes = listItmes.filter(
      (item) => item.type !== "users" && item.type !== "blockMarket"
    );
  }

  return listItmes;
};

export default tabBarConfig;
