const tabBarConfig = (username, usertype) => {
  const users = [
    {
      type: "seniorsuper",
      usertype: "2",
      name: "Senior super",
      href: "/userlist/2",
      icon: "chevron-right",
    },
    {
      type: "supermaster",
      usertype: "3",
      name: "Super master",
      href: "/userlist/3",
      icon: "chevron-right",
    },
    {
      type: "master",
      usertype: "4",
      name: "Master",
      href: "/userlist/4",
      icon: "chevron-right",
    },
    {
      type: "client",
      usertype: "5",
      name: "Client",
      href: "/userlist/5",
      icon: "chevron-right",
    },
  ];
  const listuser = users.slice(parseFloat(usertype) - 1);

  let reportlist = [
    {
      name: "Account Statement",
      href: `/accountStatement?username=${username} &usertype=${usertype}`,
      icon: "chevron-right",
    },
    { name: "Chip Summary", href: "/chipSummary", icon: "chevron-right" },
    { name: "Client P & L", href: "/clientPL", icon: "chevron-right" },
    { name: "User P & L", href: "/userPL", icon: "chevron-right" },
    { name: "Fancy Stakes", href: "/fancyStakes", icon: "chevron-right" },
    { name: "Profit & Loss", href: "/profitLoss", icon: "chevron-right" },
    { name: "Bet & History", href: "/bethistory", icon: "chevron-right" },
  ];

  if (usertype === "5") {
    reportlist = [
      {
        name: "Account Statement",
        href: `/accountStatement?username=${username} &usertype=${usertype}`,
        icon: "chevron-right",
      },
      { name: "Profit & Loss", href: "/profitLoss", icon: "chevron-right" },
      { name: "Bet & History", href: "/bethistory", icon: "chevron-right" },
    ];
  }

  if (usertype !== "1") {
    reportlist.push({
      name: "Activity",
      href: "/activity",
      icon: "chevron-right",
    });
  }

  let listItmes = [
    {
      name: "Dashboard",
      type: "dashboard",
      href: "/dashboard",
      icon: "cog",
    },
    {
      name: "Users",
      type: "users",
      items: listuser,
      icon: "user",
    },
    {
      name: "Block Market",
      type: "blockMarket",
      href: "/blockMarket",
      icon: "poll-h",
    },
    {
      name: "Running Market Analysis",
      type: "runningMarketAnalysis",
      href: "/runningMarketAnalysis",
      icon: "chart-bar",
    },
    {
      name: "Report",
      type: "report",
      items: reportlist,
      icon: "file-invoice",
    },
    {
      name: "Change password",
      type: "changePassword",
      href: "/changePassword",
      icon: "key",
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
