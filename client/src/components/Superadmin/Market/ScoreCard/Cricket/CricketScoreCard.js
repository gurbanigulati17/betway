import React, { Component } from "react";
import axios from '../../../../../axios-instance/oddsApi';
import classes from './CricketScoreCard.module.css'

class CricketScoreCard extends Component {

    intervalID; flag = true;

    state = {
        sport: null,
        score: null,
        stateOFBall: null,
        ball: []
    }

    calculateRunRate = (inning1, inning2) => {

        let runs = 0, overs = 0;
        if (inning1) {
            runs = runs + parseFloat(inning1.runs)
            overs = overs + Math.floor(inning1.overs) + (parseFloat(inning1.overs) - Math.floor(inning1.overs)) * 10 / 6
        }
        if (inning2) {
            runs = runs + parseFloat(inning2.runs)
            overs = overs + Math.floor(inning2.overs) + (parseFloat(inning2.overs) - Math.floor(inning2.overs)) * 10 / 6
        }

        return (runs / overs).toFixed(2)

    }

    calCulateRuns = (inning1, inning2) => {

        let runs = 0
        if (inning1) {
            runs = runs + parseFloat(inning1.runs)
        }
        if (inning2) {
            runs = runs + parseFloat(inning2.runs)
        }

        return parseFloat(runs)
    }

    getScore = () => {

        axios.get('/getScore/' + this.props.eventId)
            .then(response => {
                if (response.data.success) {
                    if (response.data.data.length) {
                        this.setState({
                            score: response.data.data[0].score,
                            currentGame: response.data.data[0].currentGame,
                            currentSet: response.data.data[0].currentSet,
                            matchStatus: response.data.data[0].matchStatus,
                            stateOFBall: response.data.data[0].stateOfBall ? response.data.data[0].stateOfBall : {}
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

    componentDidMount() {
        this.getScore()
    }
    componentDidUpdate(previousProps, previousState) {

        if (previousProps.eventId !== this.props.eventId) {
            this.getScore()
        }
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

    render() {

        const event = new Date(this.props.openDate);

        let board = null, winner = null

        if (this.state.score) {

            if (this.calCulateRuns(this.state.score.home.inning1, this.state.score.home.inning2) > this.calCulateRuns(this.state.score.away.inning1, this.state.score.away.inning2)) {
                winner = this.state.score.home.name
            }
            else {
                winner = this.state.score.away.name
            }
            let homeRR = null, awayRR

            if (this.state.score.home.highlight && this.state.score.home.inning1) {
                homeRR = 'CRR: ' + this.calculateRunRate(this.state.score.home.inning1, this.state.score.home.inning2)
            }
            else if (this.state.score.home.inning1) {
                homeRR = 'RR: ' + this.calculateRunRate(this.state.score.home.inning1, this.state.score.home.inning2)
            }

            if (this.state.score.away.highlight && this.state.score.away.inning1) {
                awayRR = 'CRR: ' + this.calculateRunRate(this.state.score.away.inning1, this.state.score.away.inning2)
            }
            else if (this.state.score.away.inning1) {
                awayRR = 'RR: ' + this.calculateRunRate(this.state.score.away.inning1, this.state.score.away.inning2)
            }

            board = <div className={classes.ScoreBoard}> <table className={classes.ScoreBoardTable}>

                <tbody>
                    <tr>
                        <td style={{ fontWeight: this.state.score.home.highlight ? '700' : '100' }}>{this.state.score.home.name}</td>
                        <td>{homeRR}</td>
                        <td style={{ fontWeight: this.state.score.home.highlight ? '700' : '100' }}>

                            {this.state.score.home.inning1 ?
                                <span> {this.state.score.home.inning1.runs + '-' +
                                    this.state.score.home.inning1.wickets + '(' +
                                    this.state.score.home.inning1.overs + ') '}</span> :
                                <span> Yet to bat </span>
                            }
                            {this.state.score.home.inning2 ? <span>
                                {' & ' + this.state.score.home.inning2.runs + '-' +
                                    this.state.score.home.inning2.wickets + '(' +
                                    this.state.score.home.inning2.overs + ') '}</span> :
                                null
                            }

                        </td>
                    </tr>
                    <tr>
                        <td style={{ fontWeight: this.state.score.away.highlight ? '700' : '100' }}>{this.state.score.away.name}</td>
                        <td>{awayRR}</td>
                        <td style={{ fontWeight: this.state.score.away.highlight ? '700' : '100' }}>

                            {this.state.score.away.inning1 ?
                                <span> {this.state.score.away.inning1.runs + '-' +
                                    this.state.score.away.inning1.wickets + '(' +
                                    this.state.score.away.inning1.overs + ') '}</span> :
                                <span> Yet to bat </span>
                            }
                            {this.state.score.away.inning2 ? <span>
                                {' & ' + this.state.score.away.inning2.runs + '-' +
                                    this.state.score.away.inning2.wickets + '(' +
                                    this.state.score.away.inning2.overs + ') '}</span> :
                                null
                            }

                        </td>
                    </tr>
                    {
                        this.state.matchStatus === 'InPlay' || this.state.matchStatus === 'Finished' || this.state.matchStatus === 'BetweenInnings' ?
                            <tr>
                                <td>{this.state.matchStatus === 'Finished' ? null : 'OnStrike ' + this.state.stateOFBall.batsmanName}</td>
                                {this.state.matchStatus === 'Finished' ? null :
                                    <td style={{ fontSize: '2rem' }}>
                                        {this.state.stateOFBall.dismissalTypeName === 'Not Out' ?
                                            <span>{parseFloat(this.state.stateOFBall.batsmanRuns) + parseFloat(this.state.stateOFBall.wide) + parseFloat(this.state.stateOFBall.bye) + parseFloat(this.state.stateOFBall.legBye) + parseFloat(this.state.stateOFBall.noBall)} {parseFloat(this.state.stateOFBall.wide) ? <span style={{ fontSize: '1rem' }}>wd</span> : ''} {parseFloat(this.state.stateOFBall.noBall) ? <span style={{ fontSize: '1rem' }}> No ball</span> : ''}</span> :
                                            <span style={{ fontSize: '1.5rem' }}>{this.state.stateOFBall.dismissalTypeName}</span>
                                        }
                                    </td>
                                }
                                {this.state.matchStatus === 'Finished' ? <td style={{ fontSize: '1.3rem', color: 'green' }}>{winner ? winner + ' won' : 'Draw'}</td> : null}
                                <td>{this.state.matchStatus === 'Finished' ? null : 'Bowler ' + this.state.stateOFBall.bowlerName}</td>
                            </tr> :
                            null
                    }
                </tbody>
            </table>
            </div>
        }

        return (
            <div className={classes.Scorecard}>
                <div className={classes.Head}>
                    <p className={classes.Subhead}>{this.props.eventName + '(' + event.toLocaleString('en-IN') + ')'}</p>
                </div>
                {board}
            </div>
        )
    }
}

export default CricketScoreCard;