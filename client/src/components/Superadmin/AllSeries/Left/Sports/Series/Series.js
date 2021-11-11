import React, { useEffect, useState } from 'react'
import Tree from 'react-animated-tree'
import Match from './Match/Match';
import axios from '../../../../../../axios-instance/oddsApi';
import CircularProgress from '@material-ui/core/CircularProgress';

const Series = (props) => {

    const [matches, setMatches] = useState(null)

    useEffect(() => {
        axios.get('/getMatches/' + props.eventId + '/' + props.id)
            .then(response => {
                setMatches(response.data.data)
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    let allMatches = <CircularProgress />
    if (matches) {
        allMatches = matches.map(match => {
            return <Match
                key={match.event.id}
                name={match.event.name}
                matchId={match.event.id}
            />
        })
    }
    return (
        <Tree content={props.name} open>
            {allMatches}
        </Tree>
    )
}

export default Series