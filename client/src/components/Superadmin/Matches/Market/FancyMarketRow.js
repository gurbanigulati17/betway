import React, { useState } from 'react';
import { Button, FormControl, TableCell, TableRow, Input, Switch } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            width: '30px',
            height: '30px'
        }
    },
    form: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
        }
    }
}));

const FancyMarketRow = (props) => {

    const classes = useStyles();
    const [min, setMin] = useState(props.min)
    const [max, setMax] = useState(props.max)

    return (
        <TableRow>
            <TableCell>{props.id}</TableCell>
            <TableCell>Fancy Market</TableCell>
            <TableCell
                style={{ cursor: 'pointer' }}
                onClick={props.showModal}
            >Fancy Timer: {props.timer}s</TableCell>
            <TableCell>
                <Switch
                    onChange={props.handleChange}
                    checked={props.status}
                    color="primary"
                    name="checkedB" />
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
                <FormControl>
                    <div className={classes.form}>
                        <Input
                            type='number'
                            onChange={(event) => {
                                setMin(event.target.value)
                            }}
                            value={min} />
                        <Button
                            variant="contained"
                            className={classes.button}
                            onClick={() => {
                                props.setFancyMinMarket(min)
                            }}>Set</Button>
                    </div>
                </FormControl>
            </TableCell>
            <TableCell>
                <FormControl>
                    <div className={classes.form}>
                        <Input
                            type='number'
                            onChange={(event) => {
                                setMax(event.target.value)
                            }}
                            value={max} />
                        <Button
                            variant="contained"
                            className={classes.button}
                            onClick={() => {
                                props.setFancyMaxMarket(max)
                            }}>Set</Button>
                    </div>
                </FormControl>
            </TableCell>
        </TableRow>
    )
}

export default FancyMarketRow;

