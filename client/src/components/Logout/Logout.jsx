import React,{useEffect} from 'react';
import { useHistory } from 'react-router-dom';
//import { connect } from 'react-redux';
import axios from '../../axios-instance/backendAPI';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

function Logout() {

    const history = useHistory()

    useEffect(()=>{
        if (localStorage.getItem('token')) {

            const payload = {
                client_ip: localStorage.getItem('IP')
            }

            axios.put('/user/logout', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
                .then(response => {

                    if (response.data.success || response.data.message === 'Invalid Token...') {
                        localStorage.removeItem('IP');
                        localStorage.removeItem('token');
                        alertify.success(response.data.message);
                        history.push('/login')
                    }
                    else {
                        alertify.error(response.data.message);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
        else{
            history.push('/login')
        }
    },[history])
    
    return <></>;
}

export default Logout