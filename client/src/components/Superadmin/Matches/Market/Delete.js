import React from 'react';
import { Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/core/styles";
import axios from '../../../../axios-instance/backendAPI';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

const Delete = (props) => {

    const classes = useStyles();

    function deleteMarket() {

        axios.delete('/superadmin/deleteMarket/' + props.marketId + '/' + props.eventId, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                if(response.data.success){
                    alertify.success(response.data.message);
                    props.hideModal()
                    props.getMarkets()
                }else{
                    alertify.error(response.data.message);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    return (
        <div style={{ margin: '10px' }}>
            <p>Are u sure u want to delete {props.marketId}</p>
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick={deleteMarket}>Delete</Button>
        </div>
    );
}

export default Delete;