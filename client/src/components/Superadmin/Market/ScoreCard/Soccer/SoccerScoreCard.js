import React, { Component } from "react";
import axios from '../../../../../axios-instance/oddsApi';
import classes from './SoccerScoreCard.module.css';
import LinearProgress from '@material-ui/core/LinearProgress';

class SoccerScoreCard extends Component {

    intervalID; flag = true;

    state = {
        sport: null,
        score: null,
        ball: [],
        currentGame: 0,
        currentSet: 0,
        matchStatus: null,
        now: 0
    }

    getScore = () => {

        axios.get('/getScore/' + this.props.eventId)
            .then(response => {
                if (response.data.success) {

                    if (response.data.data.length) {
                        this.setState({
                            score: response.data.data[0].score,
                            elapsedRegularTime: response.data.data[0].elapsedRegularTime,
                            elapsedAddedTime: response.data.data[0].elapsedAddedTime,
                            timeElapsed: response.data.data[0].timeElapsed,
                            now: response.data.data[0].elapsedRegularTime * 100 / 90
                        })
                        if (this.flag)
                            this.intervalID = setTimeout(this.getScore.bind(this), 5000);
                    }
                    else {
                        this.setState({
                            score: null
                        })
                        if (this.flag)
                            this.intervalID = setTimeout(this.getScore.bind(this), 10000);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    componentWillUnmount() {
        /*
           stop getData() from continuing to run even
           after unmounting this component. Notice we are calling
           'clearTimeout()` here rather than `clearInterval()` as
           in the previous example.
         */
        if (this.intervalID) {
            clearTimeout(this.intervalID);
            this.flag = false;
        }

        this.setState = (state, callback) => {
            return;
        };
    }

    componentDidMount() {
        this.getScore()
    }
    componentDidUpdate(previousProps, previousState) {
        if (previousProps.eventId !== this.props.eventId) {
            this.getScore()
        }
    }

    render() {

        let head = null, board = null, lower = null;
        const event = new Date(this.props.openDate);

        if (this.state.score) {

            board = <div className={classes.bottom}>
                <span>{this.state.score.home.score + ' : ' + this.state.score.away.score}</span>
                <hr />
                <span className={classes.center}>VS</span>
                <hr />
                <span>{this.state.elapsedRegularTime + "'"}</span>
            </div>

            head = <table className={classes.Head}>
                <thead>
                    <tr className={classes.row}>
                        <td className={classes.home}>{this.state.score.home.name}</td>
                        <td className={classes.middlePortion}>
                            <div className={classes.middle}>
                                {board}
                            </div>
                        </td>
                        <td className={classes.away}> {this.state.score.away.name}</td>
                    </tr>
                </thead>
            </table>

            lower = <LinearProgress
                variant="determinate"
                value={this.state.now} />
        } else {
            head = <div className={classes.MatchName}>
                {this.props.eventName + '(' + event.toLocaleString('en-IN') + ')'}
            </div>
        }

        return (
            <div className={classes.Scorecard}>
                {head}
                {lower}
            </div>
        )
    }
}

export default SoccerScoreCard;