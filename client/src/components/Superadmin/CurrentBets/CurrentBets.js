import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import axios from "../../../axios-instance/backendAPI";
import moment from "moment";
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Paper,
  InputBase,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Typography,
  IconButton,
  Toolbar,
} from "@material-ui/core";
import Modal from "../../UI/Modal/Modal";
import VoidBet from "./VoidBet/VoidBet";
import DeleteIcon from "@material-ui/icons/Delete";

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
  let headCells = [
    {
      id: "bet_id",
      numeric: true,
      disablePadding: false,
      label: "BetId",
    },
    {
      id: "event",
      numeric: true,
      disablePadding: false,
      label: "Event",
    },
    {
      id: "seniorsuper",
      numeric: true,
      disablePadding: false,
      label: "Seniorsuper",
    },
    {
      id: "supermaster",
      numeric: true,
      disablePadding: false,
      label: "Supermaster",
    },
    {
      id: "master",
      numeric: true,
      disablePadding: false,
      label: "Master",
    },
    {
      id: "client",
      numeric: true,
      disablePadding: false,
      label: "Client",
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
      id: "sport",
      numeric: true,
      disablePadding: false,
      label: "Sport",
    },
    {
      id: "placed_at",
      numeric: true,
      disablePadding: false,
      label: "Placed_At",
    },
  ];
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, showModal } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : null}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => {
              showModal();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    top: "120px",
    position: "relative",
    margin: "10px",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    overflow: "scroll",
    [theme.breakpoints.down("sm")]: {
      overflow: "auto",
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

export default function CurrentBets(props) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("website");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [bufferRows, setBufferRows] = useState([]);
  const [search, setSearch] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [show, setShow] = useState(false);
  const [value, setValue] = React.useState("All");
  const [selected, setSelected] = React.useState([]);
  const [shouldUpdate, setUpdate] = useState(false);

  useEffect(() => {
    axios
      .get("/superadmin/getAllBets", {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        if (response.data.success) {
          if (value === "fancy") {
            response.data.data = response.data.data.filter(
              (row) => row.type === value
            );
          } else if (value !== "All") {
            response.data.data = response.data.data.filter(
              (row) => row.sport === value
            );
          }
          setBufferRows(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [value, shouldUpdate]);

  useEffect(() => {
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

    setRows(newRows);
  }, [search, bufferRows]);

  const updateRows = () => {
    setUpdate((prevValue) => {
      return !prevValue;
    });
  };

  const hideModal = () => {
    setShow(false);
  };

  const showModal = () => {
    setShow(true);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.bet_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const clearSelected = () => {
    setSelected([]);
  };

  const handleClick = (event, bet_id) => {
    const selectedIndex = selected.indexOf(bet_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, bet_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const filter = [
    { value: "All", label: "All" },
    { value: "Cricket", label: "Cricket" },
    { value: "Soccer", label: "Soccer" },
    { value: "Tennis", label: "Tennis" },
    { value: "fancy", label: "Fancy" },
  ];

  const columns = [
    {
      id: "bet_id",
      align: "center",
    },
    {
      id: "event",
      align: "center",
      minWidth: "250px",
    },
    {
      id: "seniorsuper",
      align: "center",
    },
    {
      id: "supermaster",
      align: "center",
    },
    {
      id: "master",
      align: "center",
    },
    {
      id: "client",
      align: "center",
    },
    {
      id: "runner",
      align: "center",
      minWidth: "250px",
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
      id: "sport",
      align: "center",
    },
    {
      id: "placed_at",
      align: "center",
      minWidth: 200,
    },
  ];
  const isSelected = (bet_id) => selected.indexOf(bet_id) !== -1;

  return (
    <div className={classes.root}>
      <Modal open={show} onClose={hideModal}>
        <VoidBet
          bets={selected}
          hideModal={hideModal}
          updateRows={updateRows}
          clearSelected={clearSelected}
        />
      </Modal>
      <FormControl component="fieldset" className={classes.form}>
        <FormLabel>CurrentBets</FormLabel>
        <RadioGroup
          row
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}
        >
          {filter.map((obj) => {
            return (
              <FormControlLabel
                value={obj.value}
                control={<Radio />}
                label={obj.label}
                key={obj.value}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      <div>
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
            <EnhancedTableToolbar
              numSelected={selected.length}
              showModal={showModal}
            />
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                classes={classes}
                numSelected={selected ? selected.length : 0}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
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
                    const isItemSelected = isSelected(row.bet_id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.bet_id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.bet_id}
                        style={{
                          backgroundColor:
                            row.state === "void"
                              ? "red"
                              : row.selection === "back"
                              ? "skyblue"
                              : "pink",
                        }}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        {columns.map((column) => {
                          const value = row[column.id];

                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              padding="none"
                              style={{
                                minWidth: column.minWidth,
                                padding: "3px 0",
                              }}
                            >
                              {column.id === "event"
                                ? row.type !== "fancy"
                                  ? value + "/" + row.market
                                  : value
                                : column.id === "runner"
                                ? row.type === "fancy"
                                  ? value + "/" + row.user_rate
                                  : value
                                : column.id === "placed_at"
                                ? moment(value).format("DD-MM-YYYY HH:mm:ss")
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
  );
}
