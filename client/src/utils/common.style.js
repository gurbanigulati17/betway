import appTheme from "../styles/theme";

export const toolbarStyle = (theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
  modal: {
    marginLeft: "430px",
    marginTop: "115px",
    [theme.breakpoints.down("sm")]: {
      margin: "0",
    },
  },
  mod: {
    margin: "0px 80px",
    [theme.breakpoints.down("sm")]: {
      margin: "0",
    },
  },
  gridy: {
    marginBottom: "5px",
  },
});

export const sectionStyle = (theme) => ({
  card: {
    padding: 10,
    backgroundColor: "#e0e6e6",
    border: "1px solid #c8ced3",
    borderBottom: "1px solid #7e97a7",
    borderTop: "2px solid #315195",
    marginBottom: 20,
  },
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    backgroundColor: "#FFF",
    padding: 20,
    border: "1px solid #c8ced3",
    borderRadius: 4,
    boxShadow: "none",
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      width: "initial",
      padding: 10,
    },
  },
  titlePanel: {
    background: "linear-gradient(180deg, #2A3A43 27%, #1C282D 83%)",
    color: appTheme.colors.textLight,
    fontWeight: 700,
    border: 0,
    margin: "-21px -21px 20px -21px",
    minHeight: 1,
    padding: 10,
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      margin: "-11px -11px 10px -11px",
    },
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    width: "600%",
    [theme.breakpoints.down("sm")]: {
      width: "200%",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  search: {
    position: "relative",
    border: "1px solid #d2d6de",
    float: "right",
    margin: "0 0 5px 0",
    width: 220,
    "& input": {
      width: "100%",
      paddingLeft: 40,
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    margin: 3,
    cursor: "pointer",
    border: 0,
    background: "#1a8ee1",
    borderRadius: 2,
    color: "#FFF",
    padding: "3px 7px",
    display: "inline-block",
  },
  theme1: {
    background: "#0cb164",
  },
  theme2: {
    background: "#d62d45",
  },
  theme3: {
    background: "#d3d62d",
  },
  theme4: {
    background: "#2ca7c3",
  },
  theme5: {
    background: "#a5c32c",
  },
  theme6: {
    background: "#c3952c",
  },
  theme7: {
    background: "#dc8970",
  },
  theme8: {
    background: "#c7ab9b",
  },
  theme9: {
    background: "#1ae1cf",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  linkText: {
    cursor: "pointer",
    fontWeight: "bold",
    color: "#000",
  },
  container: {
    overflow: "auto",
  },
  sortLabel: {
    color: "#243a48 !important",
    whiteSpace: "nowrap",
    "& > svg": {
      color: "inherit !important",
    },
  },
  table: {
    overflow: "scroll",
    border: "solid 1px #c8ced3",
    backgroundColor: "#FFFFFF",
    "& thead th": {
      padding: "8px 10px",
      color: "#243a48",
      font: "700 14px Tahoma, Helvetica, sans-serif",
      backgroundColor: "#e4e4e4",
      position: "relative",
      borderRight: "solid 1px #c8ced3",
      borderBottom: "solid 2px #111",
      [theme.breakpoints.down("sm")]: {
        minWidth: "120px",
      },
    },
    "& tbody td": {
      font: "400 14px Tahoma, Helvetica, sans-serif",
      padding: "5px 12px",
      color: "#000",
      lineHeight: "1.45",
      borderRight: "solid 1px #c8ced3",
      borderBottom: "solid 1px #d9dcde",
    },
    "& tbody td p": {
      margin: 0,
    },
    "& tbody td button": {
      marginTop: "5px !important",
      marginBottom: "5px !important",
    },
  },
  backWrapper: {
    textAlign: "right",
  },
  back: {
    marginBottom: 15,
  },
});
