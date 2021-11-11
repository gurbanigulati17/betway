import React, { useState, useEffect } from 'react'
import PropTypes from "prop-types";
import { useSelector } from 'react-redux'
import { makeStyles } from "@material-ui/core/styles"
import SearchIcon from "@material-ui/icons/Search";
import axios from '../../../../axios-instance/backendAPI'
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
import { useHistory, useLocation } from 'react-router-dom'

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

    const headCells = [
        {
            id: "username",
            numeric: false,
            disablePadding: false,
            label: "username"
        },
        {
            id: "gain",
            numeric: false,
            disablePadding: false,
            label: "Total gain"
        },
        {
            id: "loss",
            numeric: false,
            disablePadding: false,
            label: "Total loss"
        }
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
    box: {
        display: 'grid',
        gridTemplateColumns: '95% 5%',
        margin: '10px 0',
        [theme.breakpoints.down("sm")]: {
            gridTemplateColumns: '90% 10%'
        }
    },
    back: {
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    head: {
        margin: '0 0 10px',
        fontWeight: 'bold'
    }
}));

export default function MarketReport() {

    const classes = useStyles()
    const location = useLocation()
    const history = useHistory()
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("website")
    const [page, setPage] = useState(0)
    const [rows, setRows] = useState([])
    const [bufferRows, setBufferRows] = useState([])
    const [search, setSearch] = useState()
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const usertype = useSelector(state => state.auth.usertype)
    const username = useSelector(state => state.auth.username)
    const [userInfo, setUserInfo] = useState({ username: '', usertype: '' })
    const [userHistory, setUserHistory] = useState([])

    const ahead = (username) => {

        if (userHistory.length !== 4) {
            let users = [...userHistory]
            users.push(username)
            setUserHistory(users)
            getUserInfo(username)
        }

    }

    const back = () => {

        if (userHistory.length > 1) {
            const users = [...userHistory]
            users.pop()
            getUserInfo(users[users.length - 1])
            setUserHistory([...users])

        }
        else {
            history.goBack()
        }
    }

    const getUserInfo = (username) => {

        axios
            .get("/user/userBalanceInfo/" + username, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            })
            .then((response) => {

                if (response.data.success) {
                    const user = {
                        username: response.data.data[0].username,
                        usertype: response.data.data[0].usertype
                    }
                    setUserInfo(user)
                }

            })
            .catch((err) => {
                console.log(err);
            });
    }

    const myInfo = () => {

        const user = {
            username: username,
            usertype: usertype
        }
        setUserInfo(user)
        const cur_user = []
        cur_user.push(username)
        setUserHistory(cur_user)
    }

    const getReport = () => {

        if (userInfo.username.length) {

            const params = new URLSearchParams(location.search);

            const payload = {
                username: userInfo.username,
                event_id: params.get('event_id'),
                event: params.get('event'),
                market: params.get('market')
            }

            axios.post('/user/showMarketReport', payload, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") },
            })
                .then(response => {
                    if (response.data.success) {
                        setBufferRows(response.data.data)
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }
    useEffect(() => {
        getReport()
    }, [userInfo.username])

    useEffect(() => {
        if (username && !userHistory.length) {
            myInfo()
        }
    }, [username])

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

    const columns = [
        {
            id: 'username',
            align: "center"
        },
        {
            id: 'gain',
            align: "center"
        },
        {
            id: 'loss',
            align: "center"
        },
    ]
    return (
        <div>
            <div className={classes.box}>
                <div className={classes.head}>Market Report</div>
                <div className={classes.back} onClick={() => {
                    back()
                }}>back</div>
            </div>

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
                                usertype={userInfo.usertype}
                            />
                            <TableBody>
                                {!rows?.length ? (
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
                                                key={row.username}>
                                                {columns.map((column, colIndex) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            width={column.minWidth}
                                                        >
                                                            {column.id === 'username' ?
                                                                <span
                                                                    style={{
                                                                        color: userInfo.usertype === '4' ? 'black' : 'blue',
                                                                        cursor: userInfo.usertype === '4' ? 'default' : 'pointer'
                                                                    }}
                                                                    onClick={() => {
                                                                        ahead(value)
                                                                    }}>{value}</span>
                                                                : <span style={{ fontWeight: '700', color: value >= 0 ? 'green' : 'red' }}>{value}</span>}
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