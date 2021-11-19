import React, { useEffect, useState, useRef } from "react";
import MarketTable from "./MarketTable/MarketTable";
import axios from "../../../../../axios-instance/backendAPI";
import odds_axios from "../../../../../axios-instance/oddsApi";
import Fancy from "./FancyTable/FancyTable";
import {
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Paper,
  TableContainer,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import CricketScoreCard from "./ScoreCard/Cricket/CricketScoreCard";
import SoccerScoreCard from "./ScoreCard/Soccer/SoccerScoreCard";
import TennisScoreCard from "./ScoreCard/Tennis/TennisScoreCard";
import Modal from "../../../../UI/Modal/Modal";
import BetSpinner from "../../../../UI/Spinner/BetSpinner";
import { useSelector } from "react-redux";

const Market = (props) => {
  const history = useHistory();
  const params = useParams();
  const ref = useRef(false);
  const [markets, setMarkets] = useState(null);
  const [marketIds, setMarketIds] = useState("");
  const [bookmakerMarketIds, setBookmakerMarketIds] = useState("");
  const [matchInfo, setMatchInfo] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [book, setBook] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [accept, setAccept] = useState(0);
  const [stakes, setStakes] = useState(null);
  const usertype = useSelector((state) => state.auth.usertype);
  const sydwsc = useRef(null);

  useEffect(() => {
    getMatchInfo();
    getMarkets();
  }, [params]);

  useEffect(() => {
    return () => {
      if (sydwsc.current && sydwsc.current.close) {
        sydwsc.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (markets) {
      if (ref.current === false) {
        ref.current = true;
        getOdds();
        // if (usertype !== '5') {
        //     setIntervalId(setInterval(getOdds, 10000))
        // } else {
        //     setIntervalId(setInterval(getOdds, 1000))
        // }
      }
    }
  }, [markets, marketIds]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    if (usertype === "5") {
      getStakes();
      acceptAnyOdds();
    }
  }, [props.stakeChanged, usertype]);

  const acceptAnyOdds = () => {
    if (localStorage.getItem("token")) {
      axios
        .get("/user/acceptAnyOdds", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((response) => {
          setAccept(response.data.data[0].any_odds);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const toggleAcceptAnyOdds = () => {
    if (localStorage.getItem("token")) {
      axios
        .put(
          "/user/toggleAcceptAnyOdds",
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.success) acceptAnyOdds();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getStakes = () => {
    axios
      .get("/user/getStakes", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setStakes(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const hideModal = () => {
    setOpen(false);
  };

  const showModal = (runner) => {
    if (!localStorage.getItem("token")) {
      history.push("/login");
      return;
    }

    axios
      .get("/user/getFancyBook/" + params.matchId + "/" + runner, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setBook(response.data.data);
          setOpen(true);
        }
      });
  };

  const handleClick = (id) => {
    setActiveId(id);
  };

  const getMatchInfo = () => {
    axios
      .get("/user/matchInfo/" + params.matchId)
      .then((response) => {
        if (response.data.success) {
          setMatchInfo(response.data.data[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getOdds = () => {
    let ids = "";
    if (!bookmakerMarketIds.length && !marketIds.length) return;
    else if (!bookmakerMarketIds.length && marketIds.length) ids = marketIds;
    else if (bookmakerMarketIds.length && !marketIds.length)
      ids = bookmakerMarketIds + "/" + bookmakerMarketIds;
    else ids = marketIds + "/" + bookmakerMarketIds;

    const BASE_URL = "ws://65.0.166.92:4600";
    sydwsc.current = new WebSocket(`${BASE_URL}/getMOdds/event/` + ids);
    sydwsc.current.onerror = (e) => {
      console.log("Something Went Wrong!");
    };
    //let wsccounter = 0;
    sydwsc.current.onmessage = (e) => {
      let response = JSON.parse(e.data);
      if (response.success) {
        let allMarkets = [...markets];

        for (let market of allMarkets) {
          if (market.manual === "no") {
            let odds = response.data.filter(
              (odds) => odds.marketId === market.id
            );
            market.odds = odds;
          }
        }
        setMarkets(allMarkets);
      }
      if (!response.data.length) {
        setTimeout(() => {
          sydwsc.current.close();
        }, 10000);
      }
    };

    // odds_axios.get('/getOdds/' + ids)
    //     .then(response => {

    //         if (response.data.success) {

    //             let allMarkets = [...markets]

    //             for (let market of allMarkets) {
    //                 if (market.manual === 'no') {
    //                     let odds = response.data.data.filter(odds => odds.marketId === market.id)
    //                     market.odds = odds
    //                 }
    //             }
    //             setMarkets(allMarkets)
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })
  };

  const getMarkets = () => {
    axios
      .get("/user/getMarketsByMatch/" + params.matchId, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          let allMarketIds = "",
            bookMarkets = "";

          for (let market of response.data.data) {
            if (market.name === "Match Odds") market.sortPriority = 2;
            else if (market.name.toLowerCase() === "bookmaker")
              market.sortPriority = 1;
            else market.sortPriority = 3;

            if (
              market.manual === "no" &&
              market.name.toLowerCase() !== "bookmaker"
            )
              allMarketIds = market.id + "," + allMarketIds;
            else if (market.name.toLowerCase() === "bookmaker")
              bookMarkets = market.id;
          }

          if (allMarketIds.endsWith(","))
            allMarketIds = allMarketIds.slice(0, -1);

          props.changeMarket(response.data.data[0]?.id, params.matchId);
          response.data.data.sort((a, b) => a.sortPriority - b.sortPriority);

          if (allMarketIds !== "" || bookMarkets !== "") {
            setIntervalId(null);
            setMarketIds(allMarketIds);
            setBookmakerMarketIds(bookMarkets);
            setMarkets(response.data.data);
            ref.current = false;
          } else {
            setMarkets(response.data.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let allMarket = <BetSpinner width="200px" />,
    scoreCard = null,
    fancyBook = null;

  if (book) {
    fancyBook = (
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
              (fancyBook = book.map((fancy) => {
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
                      style={{ color: fancy.net_profit < 0 ? "red" : "green" }}
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

  if (markets) {
    allMarket = markets
      .map((market) => {
        if (!market.odds) {
          return null;
        }
        return (
          <MarketTable
            marketId={market.id}
            key={market.id}
            name={market.name}
            adv_max={market.adv_max}
            max={market.max}
            min={market.min}
            odds={market.odds}
            startTime={market.marketStartTime}
            eventId={params.matchId}
            changeMarket={props.changeMarket}
            changeFlag={props.changeFlag}
            handleClick={handleClick}
            activeId={activeId}
            sport={matchInfo?.sport}
            eventName={matchInfo?.name}
            accept={accept}
            stakes={stakes}
            toggleAcceptAnyOdds={toggleAcceptAnyOdds}
            runners={market.runners}
          />
        );
      })
      .filter((market) => market !== null);
  }

  if (allMarket.length == undefined) {
    allMarket = <BetSpinner />;
  } else if (markets?.length === 0) {
    allMarket = null;
  }

  if (matchInfo) {
    if (matchInfo.sport === "1") {
      scoreCard = (
        <SoccerScoreCard
          eventId={params.matchId}
          eventName={matchInfo?.name}
          openDate={matchInfo?.openDate}
        />
      );
    } else if (matchInfo.sport === "2") {
      scoreCard = (
        <TennisScoreCard
          eventId={params.matchId}
          eventName={matchInfo?.name}
          openDate={matchInfo?.openDate}
        />
      );
    } else if (matchInfo.sport === "4") {
      scoreCard = (
        <CricketScoreCard
          eventId={params.matchId}
          eventName={matchInfo?.name}
          openDate={matchInfo?.openDate}
        />
      );
    }
  }

  if (matchInfo && matchInfo.sport === "4") {
    return (
      <div>
        <Modal open={open} onClose={hideModal}>
          {fancyBook}
        </Modal>
        {scoreCard}
        {allMarket}
        <Fancy
          handleClick={handleClick}
          activeId={activeId}
          matchId={params.matchId}
          eventName={matchInfo.name}
          showModal={showModal}
          sport={matchInfo.sport}
          stakes={stakes}
        />
      </div>
    );
  } else {
    return (
      <div>
        {scoreCard}
        {allMarket}
      </div>
    );
  }
};

export default Market;
