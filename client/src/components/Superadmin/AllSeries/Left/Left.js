import React, { useState, useEffect } from 'react';
import classes from './Left.module.css';
import axios from '../../../../axios-instance/oddsApi';
import Sports from './Sports/Sports';
import CircularProgress from '@material-ui/core/CircularProgress';

const LeftSection = () => {

    const [sports,setSports] = useState(null)
 
    useEffect(() => {
        axios.get('/getSports')
            .then(response => {
                setSports(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    let allSports = <CircularProgress />
    if (sports) {
        allSports = sports.map(sport => {
            return <Sports id={sport.eventType} key={sport.eventType} name={sport.name} />
        })
    }
    return (
        <div className={[classes.LeftSection, classes.fancyScroll].join(' ')}>
            {allSports}
        </div>);
}

export default LeftSection;