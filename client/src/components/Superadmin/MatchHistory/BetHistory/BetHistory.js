import React, { useState, useEffect } from 'react'
import PropTypes from "prop-types";
import { useSelector } from 'react-redux'
import { makeStyles } from "@material-ui/core/styles"
import SearchIcon from "@material-ui/icons/Search";
import axios from '../../../../axios-instance/backendAPI'
import moment from "moment";
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
} from "@material-ui/core"

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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {

  const usertype = useSelector(state => state.auth.usertype)

  let betHeadCells = [
    {
      id: "event",
      numeric: false,
      disablePadding: false,
      label: "Event",
    },
    {
      id: "runner",
      numeric: true,
      disablePadding: false,
      label: "Runner",
    },
    {
      id: "odds",
      numeric: true,
      disablePadding: false,
      label: "Odds",
    },
    {
      id: "selection",
      numeric: true,
      disablePadding: false,
      label: "Selection",
    },
    {
      id: "stake",
      numeric: true,
      disablePadding: false,
      label: "Stake",
    },
    {
      id: "profit_loss",
      numeric: true,
      disablePadding: false,
      label: "Profit/Loss",
    },
    {
      id: 'sport',
      numeric: true,
      disablePadding: false,
      label: "Sport",
    },
    {
      id: 'state',
      numeric: true,
      disablePadding: false,
      label: "State",
    },
    {
      id: "placed_at",
      numeric: true,
      disablePadding: false,
      label: "Placed_At",
    },
    {
      id: "settled_at",
      numeric: true,
      disablePadding: false,
      label: "Settled_At",
    }
  ];

  const users = [
    {
      id: 'seniorsuper',
      disablePadding: false,
      label: "Seniorsuper"
    },
    {
      id: 'supermaster',
      disablePadding: false,
      label: "supermaster"
    },
    {
      id: 'master',
      disablePadding: false,
      label: "Master"
    },
    {
      id: 'username',
      disablePadding: false,
      label: "Username"
    }
  ]
  users.splice(0, parseFloat(usertype - 1))

  const headCells = [
    {
      id: "bet_id",
      numeric: false,
      disablePadding: false,
      label: "Bet_Id",
    },
    ...users,
    ...betHeadCells
  ]

  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    overflow: "scroll",
    [theme.breakpoints.down("sm")]: {
      overflow: "auto"
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
  heading: {
    padding: "2px",
    fontWeight: "bold",
    fontSize: "0.8em",
    backgroundColor: "#e7e7e7",
    border: "1px solid #8a8a82",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    border: "1px solid black",
    float: "right",
    margin: "5px 10px 5px 0px",
    width: "18%",
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(3),
      width: "30%",
      height: "30px",
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
}));

export default function BetHistory(props) {

  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("website");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [bufferRows, setBufferRows] = useState([])
  const [search, setSearch] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const usertype = useSelector(state => state.auth.usertype)

  useEffect(() => {
    
    const payload = {
      from: props.fromTo.from,
      to: props.fromTo.to,
      event: props.eventInfo.event,
      market: props.eventInfo.market,
      eventId: props.eventInfo.eventId
    }
    axios.post('/superadmin/showBetHistory', payload, {
      headers: { Authorization: "Bearer " + localStorage.getItem("a_token") }
    })
      .then(response => {
        if (response.data.success) {
          setBufferRows(response.data.data)
        }
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  useEffect(() => {

    const columns = bufferRows[0] && Object.keys(bufferRows[0])
    let newRows = search ? bufferRows.filter(bufferRow =>
      columns.some(
        column => bufferRow[column]?.toString().toLowerCase().indexOf(search.toLowerCase()) > -1
      )) : bufferRows

    setRows(newRows)

  }, [search, bufferRows])

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

  const betColumns = [
    {
      id: "event",
      align: "left",
      minWidth: 500
    },
    {
      id: "runner",
      align: "center",
      minWidth: 300
    },
    {
      id: "odds",
      align: "center",
    },
    {
      id: "selection",
      align: "center",
    },
    {
      id: "stake",
      align: "center",
    },
    {
      id: "profit_loss",
      align: "center",
    },
    {
      id: 'sport',
      align: 'center'
    },
    {
      id: 'state',
      align: 'center'
    },
    {
      id: "placed_at",
      align: "center",
      minWidth: 200
    },
    {
      id: "settled_at",
      align: "center",
      minWidth: 200
    }
  ]

  const users = [
    {
      id: 'seniorsuper',
      align: 'center'
    },
    {
      id: 'supermaster',
      align: 'center'
    },
    {
      id: 'master',
      align: 'center'
    },
    {
      id: 'username',
      align: 'center'
    }
  ]

  users.splice(0, parseFloat(usertype - 1))

  const columns = [
    {
      id: "bet_id",
      align: "center",
    },
    ...users,
    ...betColumns
  ]

  return (
    <div>
      <div className={classes.root}>
        <Paper className={classes.paper}>
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
          <TableContainer>
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
                rowCount={rows.length}
              />
              <TableBody>
                {!rows.length ? (
                  <TableRow>
                    <TableCell>No data</TableCell>
                  </TableRow>
                ) : null}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.bet_id}
                        style={{ backgroundColor: row.state === 'void' ? 'red' : row.selection === 'back' ? 'skyblue' : 'pink' }}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              padding="none"
                              width={column.minWidth}
                            >
                              {column.id === 'event' ?
                                row.type !== 'fancy' ? value + "/" + row.market : value
                                : column.id === 'runner' ?
                                  row.type === 'fancy' ? value + "/" + row.user_rate : value
                                  : column.id === 'placed_at' || column.id === 'settled_at' ?
                                    moment(value).format('DD-MM-YYYY HH:mm:ss')
                                    : value}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>

    </div>
  )
}