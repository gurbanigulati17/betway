export const sidebarItems = (username, usertype) => {
  return [
    {
      title: "",
      type: "sports",
      items: [
        { name: "All Games", href: "/dashboard", icon: "futbol" },
        { name: "In Play", href: "/inplay", icon: "futbol" },
        {
          type: "4",
          name: "Cricket",
          href: "",
          icon: "futbol",
          items: [],
        },
        {
          type: "1",
          name: "Soccer",
          href: "",
          icon: "futbol",
          items: [],
        },
        {
          type: "2",
          name: "Tennis",
          href: "",
          icon: "futbol",
          items: [],
        },
      ],
    },
  ];
};
