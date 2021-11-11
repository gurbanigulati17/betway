import React, { Component } from "react";
import axios from "../../../../../../../axios-instance/oddsApi";
import classes from "./TennisScoreCard.module.css";

class TennisScoreCard extends Component {
  intervalID;
  flag = true;

  state = {
    sport: null,
    score: null,
    ball: [],
    currentGame: 0,
    currentSet: 0,
    matchStatus: null,
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
              currentGame: response.data.data[0].currentGame,
              currentSet: response.data.data[0].currentSet,
              matchStatus: response.data.data[0].matchStatus,
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
    let board = null,
      head = null,
      i = 1,
      j = 1,
      k = 1,
      scoreboard;
    const event = new Date(this.props.openDate);
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const startTime = new Date(this.props.openDate).toLocaleDateString(
      undefined,
      options
    );

    if (this.state.score) {
      head = (
        <div className={classes.row}>
          <p className={classes.team1}>
            {this.state.score.home ? this.state.score.home.name : null}
          </p>
          <div className={classes.score}>
            <div className={classes.Top}>
              {this.state.matchStatus === "Inprogress" &&
              this.state.currentSet ? (
                <span>
                  <span className={classes.set}>
                    {" "}
                    &nbsp;&nbsp; Set - {this.state.currentSet}{" "}
                  </span>{" "}
                  |
                  <span className={classes.game}>
                    Game - {this.state.currentGame}
                  </span>
                </span>
              ) : this.state.matchStatus === "Finished" ? (
                <span>Ended</span>
              ) : (
                <span>{startTime}</span>
              )}
            </div>
            <p>
              {this.state.matchStatus === "Inprogress" &&
              this.state.score.home.score
                ? this.state.score.home.score +
                  ":" +
                  this.state.score.away.score
                : null}
            </p>
          </div>
          <p className={classes.team2}>{this.state.score.away.name}</p>
        </div>
      );

      if (
        this.state.matchStatus === "Inprogress" ||
        (this.state.score.home && this.state.score.home.games) ||
        this.state.matchStatus === "Finished"
      ) {
        board = (
          <table className={classes.matchTable}>
            <thead>
              <tr>
                <th></th>
                {this.state.score.home.gameSequence
                  ? this.state.score.home.gameSequence.map((set) => {
                      return (
                        <th className={classes.matchData} key={i}>
                          {i++}
                        </th>
                      );
                    })
                  : "1"}
                <th className={classes.matchData}>
                  {this.state.score.home.gameSequence ? i : "2"}
                </th>
                {this.state.score.home.gameSequence ? (
                  !this.state.score.home.gameSequence.length ? (
                    <td className={classes.matchData}>2</td>
                  ) : null
                ) : null}
                <th className={classes.matchData}>T</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {this.state.score.home.name}{" "}
                  {this.state.score.home.isServing ? (
                    <span role="img" aria-label="tennis">
                      🎾
                    </span>
                  ) : null}
                </td>
                {this.state.score.home.gameSequence
                  ? this.state.score.home.gameSequence.map((set) => {
                      return (
                        <td className={classes.matchData} key={j++}>
                          {set}
                        </td>
                      );
                    })
                  : null}
                <td className={classes.matchData}>
                  {this.state.score.home.games}
                </td>
                {!(
                  this.state.score.home.gameSequence &&
                  this.state.score.home.gameSequence.length
                ) ? (
                  <td className={classes.matchData}>-</td>
                ) : null}
                <td className={classes.matchData}>
                  {this.state.score.home.sets}
                </td>
              </tr>
              <tr>
                <td>
                  {this.state.score.away.name}
                  {this.state.score.away.isServing ? (
                    <span role="img" aria-label="tennis">
                      🎾
                    </span>
                  ) : null}
                </td>
                {this.state.score.home.gameSequence
                  ? this.state.score.away.gameSequence.map((set) => {
                      return (
                        <td className={classes.matchData} key={k++}>
                          {set}
                        </td>
                      );
                    })
                  : null}
                <td className={classes.matchData}>
                  {this.state.score.away.games}
                </td>
                {!(
                  this.state.score.home.gameSequence &&
                  this.state.score.home.gameSequence.length
                ) ? (
                  <td className={classes.matchData}>-</td>
                ) : null}
                <td className={classes.matchData}>
                  {this.state.score.away.sets}
                </td>
              </tr>
            </tbody>
          </table>
        );
      } else if (
        this.state.matchStatus === "Warmup" ||
        this.state.matchStatus === "Oncourt" ||
        (this.state.matchStatus === "Inprogress" &&
          !this.state.score.home.games)
      ) {
        board = (
          <table className={classes.matchTable}>
            <thead>
              <tr>
                <th></th>
                <th className={classes.matchData}>1</th>
                <th className={classes.matchData}>2</th>
                <th className={classes.matchData}>T</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.score.home.name}</td>
                <td className={classes.matchData}>-</td>
                <td className={classes.matchData}>-</td>
                <td className={classes.matchData}></td>
              </tr>
              <tr>
                <td>{this.state.score.away.name}</td>
                <td className={classes.matchData}>-</td>
                <td className={classes.matchData}>-</td>
                <td className={classes.matchData}></td>
              </tr>
            </tbody>
          </table>
        );
      }

      scoreboard = (
        <div className={classes.Scorecard} id="scoreBoard">
          {head}
          {board}
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
        {scoreboard}
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

export default TennisScoreCard;
