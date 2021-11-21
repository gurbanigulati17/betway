import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { InputBase, Switch, Button } from "@material-ui/core";
import Modal from "../../../UI/Modal/Modal";
import SearchIcon from "@material-ui/icons/Search";
import HelperLabel from "../UserList/HelperLabel/HelperLabel";
import axios from "../../../../axios-instance/backendAPI";
import AddUser from "../UserList/Actions/AddUser";
import Deposit from "../UserList/Actions/Deposit";
import Withdraw from "../UserList/Actions/Withdraw";
import ChangePassword from "../UserList/Actions/ChangePassword/ChangePassword";
import ViewInfo from "../UserList/Actions/ViewInfo/ViewInfo";
import Settlement from "../UserList/Actions/Settlement";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import BetSpinner from "../../../UI/Spinner/BetSpinner";
import ChangeName from "../UserList/Actions/ChangeName";

import { toolbarStyle, sectionStyle } from "../../../../utils/common.style";

const useStyles = makeStyles((theme) => sectionStyle(theme));
const useToolbarStyles = makeStyles((theme) => toolbarStyle(theme));

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

const users = [
  { type: "Seniorsuper", usertype: "2" },
  { type: "Supermaster", usertype: "3" },
  { type: "Master", usertype: "4" },
  { type: "Client", usertype: "5" },
];

export default function ChildList() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("website");
  const [page, setPage] = useState(0);
  const [rows, setrows] = useState(null);
  const [bufferRows, setBufferRows] = useState([]);
  const [search, setSearch] = useState("");
  const [usertype, setUsertype] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  const columns = [
    {
      id: "username",
      align: "center",
    },
    {
      id: "uplink",
      minwidth: 170,
      align: "center",
    },
    {
      id: "credit_limit",
      minWidth: 170,
      align: "center",
    },
    {
      id: "winnings",
      minWidth: 170,
      align: "center",
    },
    {
      id: "exposure",
      minWidth: 170,
      align: "center",
    },
    {
      id: "balance",
      minWidth: 170,
      align: "center",
    },
    {
      id: "suspended",
      minWidth: 170,
      align: "center",
    },
    {
      id: "bet_suspended",
      minWidth: 170,
      align: "center",
    },
    {
      id: "action",
      minWidth: 170,
      align: "center",
    },
    {
      id: "se",
      minWidth: 170,
      align: "center",
    },
  ];
  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  function EnhancedTableHead(props) {
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
        label: users
          .filter((obj) => {
            return obj.usertype === usertype;
          })
          .map((obj) => obj.type),
      },
      {
        id: "credit_limit",
        numeric: true,
        disablePadding: false,
        label: "Credit_Limit",
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
        label: parseFloat(usertype) + 1 === 5 ? "Exposure" : "Credit_Given",
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
        label: "Bet_Suspended",
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

  const EnhancedTableToolbar = () => {
    const classes = useToolbarStyles();
    let toRender = null;

    switch (action.toRender) {
      case "addChild":
        toRender = (
          <AddUser
            handleClose={handleClose}
            usertype={parseFloat(action.usertype) + 1}
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
            userBalance={action.balance}
            uplink={action.uplink}
            downlink={action.username}
            downlink_type={action.usertype}
            uplink_type={(parseFloat(action.usertype) - 1).toString()}
          />
        );
        break;
      case "withdraw":
        toRender = (
          <Withdraw
            handleClose={handleClose}
            updateRows={updateRows}
            userBalance={action.balance}
            uplink={action.uplink}
            downlink={action.username}
            downlink_type={action.usertype}
            uplink_type={(parseFloat(action.usertype) - 1).toString()}
          />
        );
        break;
      case "password":
        toRender = (
          <ChangePassword
            handleClose={handleClose}
            username={action.username}
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
      .get("/user/userBalanceInfo/" + params.username, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUsertype(response.data.data[0].usertype);

        axios
          .get("/user/getDownlink/" + params.username, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            console.log(res.data.data);

            if (res.data.success) {
              if (!res.data.data) {
                history.goBack();
              } else {
                setBufferRows(res.data.data);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
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
    } else if (!bufferRows.length) {
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
      pathname: "/accountstatement",
      search: "?username=" + username + "&usertype=" + usertype,
    });
  };
  const modalChange = (
    perform,
    user,
    usertype,
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
      usertype: usertype,
      toRender: perform,
      balance: balance,
      uplink: uplink,
      winnings: winnings,
      commission: commission,
    };
    handleOpen();
    setAction(obj);
  };
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
              uplink={params.username}
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
                  <BetSpinner />
                </TableRow>
              )}
              {stableSort(rows, getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.username}>
                      <TableCell>{index + 1 + page}</TableCell>
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
                                  modalChange(
                                    "addChild",
                                    row.username,
                                    row.usertype,
                                    row.balance,
                                    row.uplink
                                  );
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
                                    row.usertype,
                                    row.balance,
                                    row.uplink,
                                    row.winnings,
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
                                  row.usertype,
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
                                  row.usertype,
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
                                  row.usertype,
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
                                  row.usertype,
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
                        ) : column.id === "username" && row.usertype === "5" ? (
                          <TableCell
                            key={column.id}
                            align="center"
                            padding="none"
                          >
                            {row[column.id] + "(" + row.fullname + ")"}
                          </TableCell>
                        ) : column.id === "exposure" &&
                          row[column.id] &&
                          row.usertype === "5" ? (
                          <TableCell
                            key={column.id}
                            align="center"
                            padding="none"
                          >
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                history.push("/expoBets/" + row.username);
                              }}
                            >
                              {row[column.id]}
                            </button>
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
                              inputProps={{ "aria-label": "primary checkbox" }}
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
                              inputProps={{ "aria-label": "primary checkbox" }}
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
