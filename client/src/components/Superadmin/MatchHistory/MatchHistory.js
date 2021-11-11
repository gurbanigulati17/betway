import React, { useState, useEffect } from 'react'
import DateTime from '../../UI/DateTime/DateTime'
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core/styles"
import SearchIcon from "@material-ui/icons/Search"
import axios from '../../../axios-instance/backendAPI'
import moment from "moment"
import BetHistory from './BetHistory/BetHistory'
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
import Modal from '../../UI/Modal/Modal'
import Undeclare from './Undeclare/Undeclare'

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
            id: "event",
            numeric: false,
            disablePadding: false,
            label: "Event",
        },
        {
            id: "market",
            numeric: true,
            disablePadding: false,
            label: "Market",
        },
        {
            id: "Profit_Loss",
            numeric: true,
            disablePadding: false,
            label: "Profit/Loss",
        },
        {
            id: "winner",
            numeric: true,
            disablePadding: false,
            label: "Declared",
        },
        {
            id: "settled_at",
            numeric: true,
            disablePadding: false,
            label: "Settled_At",
        },
        {
            id: "action",
            numeric: true,
            disablePadding: false,
            label: "Action",
        }
    ];

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
    box: {
        position: 'relative',
        top: '125px',
        padding: '0 5px'
    },
    root: {
        width: "100%"
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
    cell: {
        minWidth: '250px'
    },
    smallCell: {
        minWidth: '150px'
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

export default function MatchHistory() {

    const classes = useStyles();
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("website");
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [bufferRows, setBufferRows] = useState([])
    const [search, setSearch] = useState();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [total, setTotal] = useState(0)
    const [bets, setBets] = useState(false)
    const [eventInfo, setEventInfo] = useState(null)
    const [fromTo, setFromTo] = useState(null)
    const [dateCache, setDateCache] = useState(null)
    const [undeclarePacket, setUndeclarePacket] = useState({})
    const [open, setOpen] = useState(false)
    const [updateRows, setUpdateRows] = useState(false)

    const onSubmit = (from, to, value) => {

        let fromDate = from
        let toDate = to

        if (dateCache) {

            fromDate = dateCache.from
            toDate = dateCache.to
            setDateCache(null)
        }

        axios.get('/superadmin/getEventHistory/' + value + '/' + fromDate + '/' + toDate, {
            headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
        })
            .then(response => {

                if (response.data.success) {
                    setBufferRows(response.data.data)
                    setTotal(response.data.total)

                    const cur_date = {
                        from: from,
                        to: to
                    }
                    setFromTo(cur_date)

                }
            })
            .catch(error => {
                console.log(error);
            })
    }
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

    const showBets = (event, market, eventId) => {

        const cur_event = {
            event: event,
            market: market,
            eventId: eventId
        }
        setEventInfo(cur_event)
        setBets(true)
        setDateCache(fromTo)
    }

    const undeclare = (eventId, event, market, name, type) => {

        const packet = {
            event: event,
            eventId: eventId,
            marketId: market,
            name: name,
            type: type
        }
        setUndeclarePacket(packet)
        setOpen(true)
    }
    const hideModal = () => {
        setOpen(false)
    }
    const handleUpdate = () => {
        setUpdateRows(prevValue => {
            return !prevValue
        })
    }

    const filter = [
        { value: 'All', label: 'All' },
        { value: 'Cricket', label: 'Cricket' },
        { value: 'Soccer', label: 'Soccer' },
        { value: 'Tennis', label: 'Tennis' }
    ]

    const columns = [
        {
            id: "event",
            align: "left",
            minWidth: 500
        },
        {
            id: "market",
            align: "center",
            minWidth: 300
        },
        {
            id: "Profit_Loss",
            align: "center",
        },
        {
            id: "winner",
            align: "center",
        },
        {
            id: "settled_at",
            align: "center",
            minWidth: 200
        },
        {
            id: "action",
            align: "center",
            minWidth: 200
        }
    ]

    let table = <>
        <DateTime
            filter={filter}
            onSubmit={onSubmit}
            name='Profit Loss Listing'
            dateCache={dateCache}
            userInfo={updateRows}    // beacause userinfo is a dependency
        />
        <div className={classes.root}>
            <Modal open={open} onClose={hideModal}>
                <Undeclare
                    eventId={undeclarePacket.eventId}
                    event={undeclarePacket.event}
                    marketId={undeclarePacket.marketId}
                    name={undeclarePacket.name}
                    type={undeclarePacket.type}
                    hideModal={hideModal}
                    handleUpdate={handleUpdate}
                />
            </Modal>
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
                                            key={row.market + row.event}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        padding="none"
                                                        className={column.id === 'event' ? classes.cell : classes.smallCell}
                                                    >
                                                        {column.id === 'settled_at' ?
                                                            moment(value).format('DD-MM-YYYY HH:mm:ss')
                                                            : column.id === 'action' ? <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
                                                                <p style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                                                    showBets(row.event, row.market, row.event_id)
                                                                }}>Show Bets</p>
                                                                <p style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                                                    undeclare(row.event_id, row.event, row.market_id, row.market, row.type)
                                                                }}>Undeclare</p>
                                                            </div>
                                                                : value}
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    );
                                })}
                            <TableRow>
                                <TableCell colSpan='2' style={{ fontWeight: '700' }}>Total</TableCell>
                                <TableCell style={{ fontWeight: '700', color: total >= 0 ? 'green' : 'red' }} align='center'>{total.toFixed(2)}</TableCell>
                                <TableCell colSpan='2'></TableCell>
                            </TableRow>
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
    </>

    if (bets) {
        table =
            <Paper className={classes.paper}>
                <BetHistory eventInfo={eventInfo} fromTo={fromTo} />
            </Paper>
    }

    return (
        <div className={classes.box}>
            <div>{bets ?
                <p style={{ display: 'flex', justifyContent: 'space-between', marginRight: '12px' }}>
                    <span style={{ fontWeight: 'bold' }}>Bet history</span>
                    <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => {
                        setBets(false)
                    }}>Back</span>
                </p> : null}
            </div>
            {table}
        </div>
    )
}