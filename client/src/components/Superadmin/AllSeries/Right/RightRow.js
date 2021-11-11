import React from 'react';
import { Button,TableCell, TableRow,} from '@material-ui/core';

const SeriesRow = (props) => {

    return (
        <TableRow>
            <TableCell>{props.id}</TableCell>
            <TableCell><span onClick={props.showModal} style={{cursor:'pointer'}}>{props.name}</span></TableCell>
            <TableCell>{props.competitionRegion}</TableCell>
            <TableCell><Button variant="contained" color="primary"
                onClick={props.action}
                disabled={props.disable}
            >{props.sign}</Button></TableCell>
        </TableRow>
    )
}
export default SeriesRow;