import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  InputBase,
  Switch,
} from "@material-ui/core";
import Modal from "../../../UI/Modal/Modal";
import SearchIcon from "@material-ui/icons/Search";
import HelperLabel from "./HelperLabel/HelperLabel";
import axios from "../../../../axios-instance/backendAPI";
import AddUser from "./Actions/AddUser";
import Deposit from "./Actions/Deposit";
import Withdraw from "./Actions/Withdraw";
import ViewInfo from "./Actions/ViewInfo/ViewInfo";
import ChangePassword from "./Actions/ChangePassword/ChangePassword";
import Delete from "./Actions/Delete";
import Settlement from "./Actions/Settlement";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import BetSpinner from "../../../UI/Spinner/BetSpinner";
import ChangeName from "./Actions/ChangeName";

import { toolbarStyle, sectionStyle } from "../../../../utils/common.style";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => sectionStyle(theme));
const useToolbarStyles = makeStyles((theme) => toolbarStyle(theme));

function EnhancedTableHead(props) {
  const params = useParams();
  let usertype = params.usertype;

  let headCells = [
    {
      id: "username",
      numeric: false,
      disablePadding: false,
      label: "Username",
    },
    {
      id: "uplink",
      numeric: false,
      disablePadding: false,
      label: "Uplink",
    },
    {
      id: "credit_limit",
      numeric: true,
      disablePadding: false,
      label: "Credit Limit",
    },
    {
      id: "winnings",
      numeric: true,
      disablePadding: false,
      label: "Winnings",
    },
    {
      id: "exposure",
      numeric: true,
      disablePadding: false,
      label: usertype === "5" ? "Exposure" : "Credit Given",
    },
    {
      id: "balance",
      numeric: true,
      disablePadding: false,
      label: "Balance",
    },
    {
      id: "suspended",
      numeric: true,
      disablePadding: false,
      label: "Suspended",
    },
    {
      id: "bet_suspended",
      numeric: true,
      disablePadding: false,
      label: "Bet Suspended",
    },
    {
      id: "action",
      numeric: true,
      disablePadding: false,
      label: "Action",
    },
    {
      id: "se",
      numeric: true,
      disablePadding: false,
      label: "SE",
    },
  ];
  const { classes, order, orderBy, onRequestSort, uplink } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  if (uplink >= 2) {
    headCells[1].label = users[uplink - 2].type;
  }

  if (uplink === 1) {
    delete headCells[1];
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.heading} padding="default">
          S.No
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.heading}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              className={classes.sortLabel}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {/* {order === 'desc' ? 'sorted descending' : 'sorted ascending'} */}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
const users = [
  { type: "Seniorsuper", usertype: "2" },
  { type: "Supermaster", usertype: "3" },
  { type: "Master", usertype: "4" },
  { type: "Client", usertype: "5" },
];

export default function UserList() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("website");
  const [page, setPage] = useState(0);
  const [rows, setrows] = useState(null);
  const [bufferRows, setBufferRows] = useState([]);
  const [search, setSearch] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [show, setShowAdd] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    balance: "",
    usertype: "",
    coins_generated: "",
  });
  const [uplink, setUplink] = useState(0);
  const [shouldUpdate, setUpdate] = useState(false);
  const [action, setAction] = useState({ toRender: "", username: "" });
  const [open, setOpen] = React.useState(false);
  const [bigmodal, setBigmodal] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setAction();
  };
  const handleClose = () => {
    setOpen(false);
  };
  const params = useParams();
  const history = useHistory();

  let usertype = params.usertype;

  const columns = [
    {
      id: "username",
      align: "left",
      name: "Username",
    },
    {
      id: "uplink",
      minwidth: 170,
      align: "left",
      name: "Uplink",
    },
    {
      id: "credit_limit",
      minWidth: 170,
      align: "right",
      name: "Credit Limit",
    },
    {
      id: "winnings",
      minWidth: 170,
      align: "center",
      name: "Winnings",
    },
    {
      id: "exposure",
      minWidth: 170,
      align: "right",
      name: "Exposure",
    },
    {
      id: "balance",
      minWidth: 170,
      align: "right",
      name: "Balance",
    },
    {
      id: "suspended",
      minWidth: 170,
      align: "center",
      name: "Suspended",
    },
    {
      id: "bet_suspended",
      minWidth: 170,
      align: "center",
      name: "Bet Suspended",
    },
    {
      id: "action",
      minWidth: 170,
      align: "center",
      name: "Action",
    },
    {
      id: "se",
      minWidth: 170,
      align: "center",
      name: "SE",
    },
  ];

  const EnhancedTableToolbar = () => {
    const classes = useToolbarStyles();
    const params = useParams();

    let toRender = null;

    switch (action.toRender) {
      case "add":
        toRender = (
          <AddUser
            handleClose={handleClose}
            paper={classes.paper}
            gridy={classes.gridy}
            usertype={parseFloat(params.usertype)}
            uplink={userInfo.username}
            updateRows={updateRows}
          />
        );
        break;
      case "addChild":
        toRender = (
          <AddUser
            handleClose={handleClose}
            paper={classes.paper}
            gridy={classes.gridy}
            usertype={parseFloat(params.usertype) + 1}
            uplink={action.username}
            updateRows={updateRows}
          />
        );
        break;
      case "deposit":
        toRender = (
          <Deposit
            handleClose={handleClose}
            updateRows={updateRows}
            paper={classes.paper}
            gridy={classes.gridy}
            userBalance={action.balance}
            coins_generated={userInfo.coins_generated}
            uplink={params.usertype === "2" ? "admin" : action.uplink}
            downlink={action.username}
            downlink_type={params.usertype}
            uplink_type={(parseFloat(params.usertype) - 1).toString()}
          />
        );
        break;
      case "withdraw":
        toRender = (
          <Withdraw
            handleClose={handleClose}
            updateRows={updateRows}
            paper={classes.paper}
            gridy={classes.gridy}
            userBalance={action.balance}
            coins_withdrawn={userInfo.coins_withdrawn}
            uplink={params.usertype === "2" ? "admin" : action.uplink}
            downlink={action.username}
            downlink_type={params.usertype}
            uplink_type={(parseFloat(params.usertype) - 1).toString()}
          />
        );
        break;
      case "password":
        toRender = (
          <ChangePassword
            handleClose={handleClose}
            username={action.username}
            paper={classes.paper}
          />
        );
        break;
      case "delete":
        toRender = (
          <Delete
            handleClose={handleClose}
            username={action.username}
            usertype={action.usertype}
            paper={classes.paper}
            updateRows={updateRows}
          />
        );
        break;
      case "viewinfo":
        toRender = (
          <ViewInfo
            handleClose={handleClose}
            username={action.username}
            commission={action.commission}
            updateRows={updateRows}
          />
        );
        break;
      case "settlement":
        toRender = (
          <Settlement
            handleClose={handleClose}
            updateRows={updateRows}
            uplink={params.usertype === "2" ? "admin" : action.uplink}
            downlink={action.username}
            chips={action.winnings}
          />
        );
        break;
      case "fullname":
        toRender = (
          <ChangeName
            username={action.username}
            handleClose={handleClose}
            updateRows={updateRows}
          />
        );
        break;
      default:
        break;
    }
    return (
      <Modal
        open={open}
        bigmodal={bigmodal}
        onClose={handleClose}
        isOuterStructure
      >
        {toRender}
      </Modal>
    );
  };

  useEffect(() => {
    axios
      .get("/user/info", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res1) => {
        if (res1.data.message === "Invalid Token...") {
          return;
        }

        if (res1.data.success) {
          let myUsertype = parseFloat(res1.data.data[0].usertype);
          let usertype = parseFloat(params.usertype);
          let user;
          if (res1.data.data[0].usertype === "1") {
            user = {
              username: res1.data.data[0].username,
              usertype: res1.data.data[0].usertype,
              coins_generated: res1.data.data[0].coins_generated,
              coins_withdrawn: res1.data.data[0].coins_withdrawn,
            };
          } else {
            user = {
              username: res1.data.data[0].username,
              usertype: res1.data.data[0].usertype,
              balance: res1.data.data[0].balance,
            };
          }
          setUserInfo(user);
          setUplink(usertype - myUsertype);
          if (usertype - myUsertype === 1) {
            setShowAdd(true);
          } else {
            setShowAdd(false);
          }

          axios
            .get("/user/getUsers/" + usertype, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            })
            .then((res) => {
              if (res.data.success) {
                setBufferRows(res.data.data);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params, history, shouldUpdate]);

  useEffect(() => {
    if (bufferRows && bufferRows.length) {
      const columns = bufferRows[0] && Object.keys(bufferRows[0]);
      let newRows = search
        ? bufferRows.filter((bufferRow) =>
            columns.some(
              (column) =>
                bufferRow[column]
                  ?.toString()
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) > -1
            )
          )
        : bufferRows;

      setrows(newRows);
    } else {
      setrows([]);
    }
  }, [search, bufferRows]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const updateRows = () => {
    setUpdate((prevValue) => {
      return !prevValue;
    });
  };

  const accountStatement = (username, usertype) => {
    history.push({
      pathname: "/accountStatement",
      search: "?username=" + username + "&usertype=" + usertype,
    });
  };

  const modalChange = (
    perform,
    user,
    balance,
    uplink,
    winnings,
    commission
  ) => {
    if (perform === "viewinfo") {
      setBigmodal(true);
    } else {
      setBigmodal(false);
    }
    const obj = {
      username: user,
      toRender: perform,
      balance: balance,
      uplink: uplink,
      winnings: winnings,
      commission: commission,
    };
    handleOpen();
    setAction(obj);
  };
  if (uplink === 1) {
    delete columns[1];
  }

  const toggleSuspend = (username) => {
    const payload = {
      username: username,
    };
    axios
      .put("/user/toggleSuspend", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          updateRows();
          alertify.success(response.data.message);
        } else {
          alertify.error(response.data.message);
        }
      })
      .catch((error) => {
        alertify.error(error);
      });
  };
  const toggleBetSuspend = (username) => {
    const payload = {
      username: username,
    };
    axios
      .put("/user/toggleBetSuspend", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          updateRows();
          alertify.success(response.data.message);
        } else {
          alertify.error(response.data.message);
        }
      })
      .catch((error) => {
        alertify.error(error);
      });
  };

  //const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <>
      <div className={classes.card}>
        <HelperLabel />
      </div>

      <Paper className={classes.paper}>
        <div className={classes.titlePanel}>
          <span className={classes.title}>
            {users
              .filter((obj) => {
                return parseFloat(obj.usertype) === parseFloat(usertype) + 1;
              })
              .map((obj) => obj.type)}{" "}
            listing
          </span>
        </div>
        <EnhancedTableToolbar />
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onChange={handleSearch}
            inputProps={{ "aria-label": "search" }}
          />
        </div>
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows ? rows.length : 0}
              uplink={uplink}
            />
            <TableBody>
              {rows ? (
                !rows.length ? (
                  <TableRow>
                    <TableCell>No data</TableCell>
                  </TableRow>
                ) : null
              ) : (
                <TableRow className={classes.loader}>
                  <BetSpinner width="150px" height="130px" />
                </TableRow>
              )}
              {stableSort(rows, getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.username}>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return column.id === "action" ? (
                          <TableCell
                            key={column.id}
                            align="center"
                            padding="none"
                            style={{ minWidth: "300px" }}
                          >
                            {row.usertype === "5" ? null : (
                              <button
                                onClick={() => {
                                  modalChange("addChild", row.username);
                                }}
                                className={`${classes.actionButton}`}
                              >
                                A
                              </button>
                            )}
                            <button
                              className={`${classes.actionButton} ${classes.theme1}`}
                              onClick={() => {
                                accountStatement(row.username, row.usertype);
                              }}
                            >
                              S
                            </button>
                            <button
                              className={`${classes.actionButton} ${classes.theme2}`}
                              onClick={() => {
                                history.push("/userProfitLoss/" + row.username);
                              }}
                            >
                              PL
                            </button>
                            {row.usertype === "5" ? (
                              <button
                                className={`${classes.actionButton} ${classes.theme3}`}
                                onClick={() => {
                                  modalChange(
                                    "viewinfo",
                                    row.username,
                                    row.balance,
                                    row.winnings,
                                    row.uplink,
                                    row.commission
                                  );
                                }}
                              >
                                I
                              </button>
                            ) : null}
                            <button
                              className={`${classes.actionButton} ${classes.theme4}`}
                              onClick={() => {
                                modalChange(
                                  "password",
                                  row.username,
                                  row.balance,
                                  row.uplink
                                );
                              }}
                            >
                              P
                            </button>
                            <button
                              onClick={() => {
                                modalChange(
                                  "deposit",
                                  row.username,
                                  row.balance,
                                  row.uplink
                                );
                              }}
                              className={`${classes.actionButton} ${classes.theme5}`}
                            >
                              D
                            </button>
                            <button
                              onClick={() => {
                                modalChange(
                                  "withdraw",
                                  row.username,
                                  row.balance,
                                  row.uplink
                                );
                              }}
                              className={`${classes.actionButton} ${classes.theme6}`}
                            >
                              W
                            </button>
                            <button
                              onClick={() => {
                                modalChange(
                                  "fullname",
                                  row.username,
                                  row.balance,
                                  row.uplink
                                );
                              }}
                              className={`${classes.actionButton} ${classes.theme7}`}
                            >
                              C
                            </button>
                            <button
                              onClick={() => {
                                history.push("/userActivity/" + row.username);
                              }}
                              className={`${classes.actionButton} ${classes.theme8}`}
                            >
                              L
                            </button>
                            {userInfo.usertype === "1" ? (
                              <button
                                onClick={() => {
                                  modalChange(
                                    "delete",
                                    row.username,
                                    row.balance,
                                    row.uplink
                                  );
                                }}
                                className={`${classes.actionButton} ${classes.theme9}`}
                              >
                                Del
                              </button>
                            ) : null}
                          </TableCell>
                        ) : column.id === "se" ? (
                          <TableCell
                            key={column.id}
                            align="center"
                            padding="none"
                          >
                            <button
                              className={`${classes.actionButton} ${classes.theme1}`}
                              onClick={() => {
                                modalChange(
                                  "settlement",
                                  row.username,
                                  row.balance,
                                  row.uplink,
                                  row.winnings
                                );
                              }}
                            >
                              SE
                            </button>
                          </TableCell>
                        ) : column.id === "username" && row.usertype !== "5" ? (
                          <TableCell
                            key={column.id}
                            align="center"
                            padding="none"
                          >
                            <Link
                              className={classes.linkText}
                              to={"/childlist/" + row.username}
                            >
                              {row[column.id] + "(" + row.fullname + ")"}
                            </Link>
                          </TableCell>
                        ) : column.id === "exposure" &&
                          row[column.id] &&
                          row.usertype === "5" ? (
                          <TableCell
                            key={column.id}
                            align="right"
                            padding="none"
                          >
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                history.push("/expoBets/" + row.username);
                              }}
                              className="btn btn-primary"
                            >
                              {row[column.id]}
                            </button>
                          </TableCell>
                        ) : column.id === "username" && row.usertype === "5" ? (
                          <TableCell
                            key={column.id}
                            align="center"
                            padding="none"
                          >
                            {row[column.id] + "(" + row.fullname + ")"}
                          </TableCell>
                        ) : column.id === "bet_suspended" ? (
                          <TableCell
                            key={column.id}
                            align="center"
                            padding="none"
                          >
                            <Switch
                              checked={row.bet_suspended === 1 ? true : false}
                              onChange={() => {
                                toggleBetSuspend(row.username);
                              }}
                              color="primary"
                              name="checkedB"
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                            />
                          </TableCell>
                        ) : column.id === "suspended" ? (
                          <TableCell
                            key={column.id}
                            align="center"
                            padding="none"
                          >
                            <Switch
                              checked={row.suspended === 1 ? true : false}
                              onChange={() => {
                                toggleSuspend(row.username);
                              }}
                              color="primary"
                              name="checkedB"
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                            />
                          </TableCell>
                        ) : (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={rows ? rows.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
