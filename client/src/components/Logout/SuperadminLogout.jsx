import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {

    useEffect(() => {
        localStorage.removeItem('a_token')
    }, [])

    return <Redirect to="/superadmin/login" />
}

export default Logout;