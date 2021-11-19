export const sidebarItems = (username, usertype) => {
  return [
    {
      title: "Sports",
      type: "sports",
      items: [
        { name: "Home", href: "/dashboard", type: "home" },
        { name: "In Play", href: "/inplay", type: "inPlay" },
        {
          type: "4",
          name: "Cricket",
          href: "",
          items: [],
        },
        {
          type: "1",
          name: "Soccer",
          href: "",
          items: [],
        },
        {
          type: "2",
          name: "Tennis",
          href: "",
          items: [],
        },
      ],
    },
  ];
};
