import React, { useEffect,useState } from 'react'
import Tree from 'react-animated-tree'
import axios from '../../../../../axios-instance/oddsApi';
import CircularProgress from '@material-ui/core/CircularProgress';
import Series from './Series/Series';

const Sport = (props) => {

    const [series,setSeries] = useState(null)

    useEffect(() => {
        axios.get('/getSeries/' + props.id)
            .then(response => {
                setSeries(response.data.data)
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    let allSeries = <CircularProgress />

    if (series) {
        allSeries = series.map(series => {
            return <Series
                key={series.competition.id}
                name={series.competition.name}
                id={series.competition.id}
                eventId={props.id}
            />
        })
    }
    return (
        <Tree content={props.name}>
            {allSeries}
        </Tree>
    )
}

export default Sport