import React from 'react';
import axios from '../../../axios-instance/backendAPI';
import { Button, Paper } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/core/styles";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

const Delete = (props) => {

    const classes = useStyles();

    function deleteMatch() {

        axios.delete('/superadmin/deleteMatch/' + props.eventId, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {

                if (response.data.success) {
                    props.hideModal()
                    props.getMatches()
                    alertify.success(response.data.message);
                } else {
                    alertify.error(response.data.message);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <Paper>
            <div style={{ margin: '10px' }}>
                <p>Are u sure u want to delete {props.eventId}</p>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                    onClick={deleteMatch}>Delete</Button>
            </div>
        </Paper>
    );
}

export default Delete;