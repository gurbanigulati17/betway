import React, { Component } from "react";
import classes from "./Settle.module.css";
import axios from "../../../axios-instance/backendAPI";
import {
  Button,
  Table,
  Paper,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import Modal from "../../UI/Modal/Modal";
import Select from "react-select";
import MatchRunners from "./MatchRunners";
import FancyPass from "./FancyPass";

const styleButton = {
  padding: "5px 10px",
  margin: "5px 10px",
};
const options = [
  { value: "All", label: "All" },
  { value: "Cricket", label: "Cricket" },
  { value: "Soccer", label: "Soccer" },
  { value: "Tennis", label: "Tennis" },
];

class Settle extends Component {
  state = {
    sport: { value: "All", label: "All" },
    show: false,
    events: [],
    matches: [],
    runners: [],
    eventId: null,
    marketId: null,
    eventName: null,
    eventMarket: null,
    runnerId: null,
    runner: null,
    showRunner: false,
    showPass: false,
    book: false,
  };
  hideModal = () => {
    this.setState({ show: false });
  };
  handleChange = (sport) => {
    this.setState({ sport: sport });
  };
  showFancy = (eventId, runner) => {
    axios
      .get("/superadmin/getFancyBook/" + eventId + "/" + runner, {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        if (response.data.success) {
          this.setState({ book: response.data.data, show: true });
        }
      });
  };
  showMatches = () => {
    if (!this.state.sport.value) {
      alert("Please select a sport");
    }
    this.getMatches();
    if (
      this.state.sport.value === "All" ||
      this.state.sport.value === "Cricket"
    ) {
      this.getFancyEvents();
    } else {
      this.setState({ events: [] });
    }
  };
  componentDidMount() {
    this.getMatches();
    this.getFancyEvents();
  }
  getMatches = () => {
    if (this.state.sport.value) {
      let url;
      if (this.state.sport.value === "All") {
        url = "/superadmin/getAllMatchesToSettle";
      } else {
        url = "/superadmin/getMatchesToSettle/" + this.state.sport.value;
      }

      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("a_token"),
          },
        })
        .then((response) => {
          this.setState({ matches: response.data.result });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  getFancyEvents = () => {
    axios
      .get("/superadmin/getFancyEvents", {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then(async (response) => {
        if (response.data.success) {
          let allEvents = response.data.result;
          if (!allEvents.length) {
            this.setState({ events: allEvents });
          } else {
            let eventArray = [];
            for (let event of allEvents) {
              try {
                let res = await axios.get(
                  "/superadmin/getFanciesToSettle/" + event.event_id,
                  {
                    headers: {
                      Authorization:
                        "Bearer " + localStorage.getItem("a_token"),
                    },
                  }
                );
                let fancies = res.data.result;

                let newEvent = {
                  event: event,
                  fancies: fancies,
                };
                eventArray.push(newEvent);
              } catch (err) {
                throw new Error(err);
              }
            }
            this.setState({ events: eventArray });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  settleMatch = (eventId, marketId, eventName, marketName) => {
    this.setState({
      show: true,
      eventId: eventId,
      marketId: marketId,
      eventName: eventName,
      marketName: marketName,
      showRunner: true,
      showPass: false,
    });

    axios
      .get("/superadmin/getRunners/" + marketId, {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        this.setState({ runners: response.data.result });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  settleFancy = (eventName, eventId, runnerName, runnerId) => {
    this.setState({
      show: true,
      eventId: eventId,
      runnerId: runnerId,
      eventName: eventName,
      runnerName: runnerName,
      showRunner: false,
      showPass: true,
    });
  };

  render() {
    let exchangeMarket = null,
      fancyMarket = null,
      fancyBook = null;

    if (this.state.matches.length) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      exchangeMarket = this.state.matches.map((match) => {
        return (
          <TableRow key={match.event_id + match.market_id}>
            <TableCell
              style={{ cursor: "pointer" }}
              onClick={() => {
                this.props.history.push(
                  "/superadmin/fullmarket/" + match.event_id
                );
              }}
            >
              {match.event +
                "(" +
                new Date(match.openDate).toLocaleDateString(
                  undefined,
                  options
                ) +
                ")"}
            </TableCell>
            <TableCell>{match.market}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                onClick={() => {
                  this.settleMatch(
                    match.event_id,
                    match.market_id,
                    match.event,
                    match.market
                  );
                }}
              >
                Settle
              </Button>
            </TableCell>
          </TableRow>
        );
      });
      exchangeMarket = (
        <div style={{ margin: "0 10px" }}>
          <h3 style={{ color: "orange" }}>Exchange Market</h3>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Match Name</TableCell>
                  <TableCell>Settle</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{exchangeMarket}</TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    } else {
      exchangeMarket = <p style={{ margin: "10px" }}>No matches to Settle</p>;
    }

    if (this.state.events.length) {
      fancyMarket = this.state.events.map((event) => {
        let fancies = event.fancies.map((fancy) => {
          return (
            <TableRow key={fancy.runner_id}>
              <TableCell
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.showFancy(event.event.event_id, fancy.runner_id);
                }}
              >
                {fancy.runner}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => {
                    this.settleFancy(
                      event.event.name,
                      event.event.event_id,
                      fancy.runner,
                      fancy.runner_id
                    );
                  }}
                >
                  Settle
                </Button>
              </TableCell>
            </TableRow>
          );
        });
        return (
          <div key={event.event.event_id}>
            <h4>{event.event.name}</h4>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Fancy Name</TableCell>
                    <TableCell>Settle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{fancies}</TableBody>
              </Table>
            </TableContainer>
          </div>
        );
      });
      fancyMarket = (
        <div style={{ margin: "10px" }}>
          <h3 style={{ margin: "10px 0 20px", color: "orange" }}>
            Fancy Market
          </h3>
          {fancyMarket}
        </div>
      );
    }
    let showInModal;
    if (this.state.showRunner) {
      showInModal = (
        <div>
          <h4>{this.state.eventName + "/" + this.state.marketName}</h4>
          <MatchRunners
            hideModal={this.hideModal}
            eventId={this.state.eventId}
            marketId={this.state.marketId}
            eventName={this.state.eventName}
            marketName={this.state.marketName}
            runners={this.state.runners}
            getMatches={this.getMatches}
          />
        </div>
      );
    } else if (this.state.showPass) {
      showInModal = (
        <div
          style={{
            margin: "10px",
          }}
        >
          <h4>{this.state.eventName + "/" + this.state.runnerName}</h4>
          <FancyPass
            hideModal={this.hideModal}
            eventId={this.state.eventId}
            runnerId={this.state.runnerId}
            eventName={this.state.eventName}
            runnerName={this.state.runnerName}
            getFancyEvents={this.getFancyEvents}
          />
        </div>
      );
    } else if (this.state.book) {
      showInModal = (
        <TableContainer componenet={Paper} style={{ maxHeight: "400px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Run</TableCell>
                <TableCell align="center">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (fancyBook = this.state.book.map((fancy) => {
                  return (
                    <TableRow
                      key={fancy.user_rate}
                      style={{
                        backgroundColor:
                          fancy.color === "red" ? "pink" : "skyblue",
                      }}
                    >
                      <TableCell align="center">{fancy.user_rate}</TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color: fancy.net_profit < 0 ? "red" : "green",
                        }}
                      >
                        {fancy.net_profit < 0
                          ? -fancy.net_profit
                          : fancy.net_profit}
                      </TableCell>
                    </TableRow>
                  );
                }))
              }
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    return (
      <div>
        <Modal open={this.state.show} onClose={this.hideModal}>
          {showInModal}
        </Modal>
        <div className={classes.nav}>
          <Select
            id="sport"
            value={this.state.sport}
            onChange={this.handleChange}
            options={options}
          />
          <Button
            variant="contained"
            style={styleButton}
            onClick={this.showMatches}
          >
            Submit
          </Button>
        </div>
        {exchangeMarket}
        {fancyMarket}
      </div>
    );
  }
}

export default Settle;
