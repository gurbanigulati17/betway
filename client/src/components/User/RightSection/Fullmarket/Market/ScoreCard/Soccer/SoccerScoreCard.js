import React, { Component } from "react";
import axios from "../../../../../../../axios-instance/oddsApi";
import classes from "./SoccerScoreCard.module.css";
import LinearProgress from "@material-ui/core/LinearProgress";

class SoccerScoreCard extends Component {
  intervalID;
  flag = true;

  state = {
    sport: null,
    score: null,
    ball: [],
    currentGame: 0,
    currentSet: 0,
    matchStatus: null,
    now: 0,
    isMobile: window.matchMedia("only screen and (max-width: 480px)").matches,
    isTab: window.matchMedia("only screen and (max-width: 767px)").matches,
    playstreaming: false,
  };

  getScore = () => {
    axios
      .get("/getScore/" + this.props.eventId)
      .then((response) => {
        if (response.data.success) {
          if (response.data.data.length) {
            this.setState({
              score: response.data.data[0].score,
              elapsedRegularTime: response.data.data[0].elapsedRegularTime,
              elapsedAddedTime: response.data.data[0].elapsedAddedTime,
              timeElapsed: response.data.data[0].timeElapsed,
              now: (response.data.data[0].elapsedRegularTime * 100) / 90,
            });
            if (this.flag)
              this.intervalID = setTimeout(this.getScore.bind(this), 20000);
          } else {
            this.setState({
              score: null,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
    this.getScore();

    const scrollElement = document.getElementById("main");
    scrollElement.addEventListener("scroll", this.positionStreaming);
    this.positionStreaming();
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.eventId !== this.props.eventId) {
      this.getScore();
    }
  }

  streamingplay = () => {
    const { playstreaming } = this.state;
    this.setState(
      {
        playstreaming: playstreaming ? false : true,
        scorecard: playstreaming ? true : false,
      },
      this.positionStreaming
    );
  };

  positionStreaming = () => {
    const headerHeight = 100;
    const scorecardHeaderHeight =
      document.getElementById("scoreCardHead")?.scrollHeight || 0;
    const scoreBoardHeight =
      document.getElementById("scoreBoard")?.scrollHeight || 0;
    const scrollElement = document.getElementById("main");
    const iframe = document.getElementById("destination");

    const topHeight = scorecardHeaderHeight + scoreBoardHeight;

    if (!iframe) return;

    if (scrollElement.scrollTop > 0 && scrollElement.scrollTop <= topHeight) {
      iframe.style.top = `${
        headerHeight + (topHeight - scrollElement.scrollTop)
      }px`;
    } else if (scrollElement.scrollTop >= topHeight) {
      iframe.style.top = `${headerHeight}px`;
    } else {
      iframe.style.top = `${headerHeight + topHeight}px`;
    }
  };

  render() {
    let board = null;
    const event = new Date(this.props.openDate);

    if (this.state.score) {
      board = (
        <div id="scoreBoard">
          <table className={classes.board}>
            <thead>
              <tr className={classes.row}>
                <td className={classes.home}>{this.state.score.home.name}</td>
                <td className={classes.middlePortion}>
                  <div className={classes.middle}>
                    <div className={classes.bottom}>
                      <span>
                        {this.state.score.home.score +
                          " : " +
                          this.state.score.away.score}
                      </span>
                      <hr />
                      <span className={classes.center}>VS</span>
                      <hr />
                      <span>{this.state.elapsedRegularTime + "'"}</span>
                    </div>
                  </div>
                </td>
                <td className={classes.away}> {this.state.score.away.name}</td>
              </tr>
            </thead>
          </table>
          <LinearProgress variant="determinate" value={this.state.now} />
        </div>
      );
    }

    return (
      <div className={classes.Scorecard}>
        <div className={classes.Head} id="scoreCardHead">
          <p className={classes.Subhead}>
            {this.props.eventName + "(" + event.toLocaleString("en-IN") + ")"}
          </p>
          {this.state.isMobile && this.state.isTab ? (
            <img
              className={classes.tvIcon}
              onClick={() => this.streamingplay()}
              src="https://files.raksahb.com/static/snk/brand/3/icon/png/tv-white.png"
              alt="Live Games"
            />
          ) : null}
        </div>
        {board}
        {this.state.playstreaming && (this.state.isMobile || this.state.isTab) && (
          <div id="frameWrapper" className={classes.frameWrapper}>
            {
              <iframe
                id="destination"
                className={classes.destination}
                allowfullscreen
                src="https://livingstreamvdo.com?aHR0cHM6Ly93d3cuYmJiZ2FtZXMueHl6"
                frameborder="0"
                onClick={this.click}
              ></iframe>
            }
          </div>
        )}
      </div>
    );
  }
}

export default SoccerScoreCard;
