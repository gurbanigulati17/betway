import React, { useEffect, useState, useRef } from "react";
import MarketTable from "./MarketTable/MarketTable";
import axios from "../../../axios-instance/backendAPI";
import odds_axios from "../../../axios-instance/oddsApi";
import Fancy from "./FancyTable/FancyTable";
import { useParams } from "react-router-dom";
// import CricketScoreCard from "./ScoreCard/Cricket/CricketScoreCard";
// import SoccerScoreCard from "./ScoreCard/Soccer/SoccerScoreCard";
// import TennisScoreCard from "./ScoreCard/Tennis/TennisScoreCard";

const Market = () => {
  const params = useParams();
  const ref = useRef(false);
  const [markets, setMarkets] = useState(null);
  const [marketIds, setMarketIds] = useState("");
  const [matchInfo, setMatchInfo] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    getMatchInfo();
    getMarkets();
    getOdds();
  }, [params]);

  useEffect(() => {
    if (markets) {
      if (ref.current === false) {
        ref.current = true;
        getOdds();
        setIntervalId(setInterval(getOdds, 6000));
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

  function getMatchInfo() {
    axios
      .get("/superadmin/matchInfo/" + params.matchId)
      .then((response) => {
        if (response.data.success) {
          setMatchInfo(response.data.data[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function getOdds() {
    if (marketIds.length) {
      odds_axios
        .get("/getOdds/" + marketIds)
        .then((response) => {
          if (response.data.success) {
            let allMarkets = [...markets];

            for (let market of allMarkets) {
              if (market.manual === "no") {
                let odds = response.data.data.filter(
                  (odds) => odds.marketId === market.id
                );
                market.odds = odds;
              }
            }
            setMarkets(allMarkets);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function getMarkets() {
    axios
      .get("/superadmin/getMarketsByMatch/" + params.matchId, {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        if (response.data.success) {
          let allMarketIds = "";

          for (let market of response.data.data) {
            if (market.manual === "no")
              allMarketIds = market.id + "," + allMarketIds;
          }

          for (const market of response.data.data) {
            if (market.name === "Match Odds") {
              market.sortPriority = 1;
            } else if (market.name === "Bookmaker") {
              market.sortPriority = 2;
            } else {
              market.sortPriority = 3;
            }
          }
          response.data.data.sort((a, b) => a.sortPriority - b.sortPriority);

          if (allMarketIds !== "") {
            setIntervalId(null);
            setMarketIds(allMarketIds);
            setMarkets(response.data.data);
            ref.current = false;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  let allMarket = null;
  // scoreCard = null

  if (markets) {
    allMarket = markets.map((market) => {
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
          sport={matchInfo.sport}
          eventName={matchInfo.name}
          runners={market.runners}
        />
      );
    });
  }

  // if (matchInfo) {

  //     if (matchInfo.sport === '1') {

  //         scoreCard = <SoccerScoreCard
  //             eventId={params.matchId}
  //             eventName={matchInfo.name}
  //             openDate={matchInfo.openDate}
  //         />

  //     }
  //     else if (matchInfo.sport === '2') {
  //         scoreCard = <TennisScoreCard
  //             eventId={params.matchId}
  //             eventName={matchInfo.name}
  //             openDate={matchInfo.openDate}
  //         />
  //     }
  //     else if (matchInfo.sport === '4') {

  //         scoreCard = <CricketScoreCard
  //             eventId={params.matchId}
  //             eventName={matchInfo.name}
  //             openDate={matchInfo.openDate}
  //         />
  //     }
  // }

  if (matchInfo && matchInfo.sport === "4") {
    return (
      <div>
        {/* {scoreCard} */}
        {allMarket}
        <Fancy
          matchId={params.matchId}
          eventName={matchInfo.name}
          sport={matchInfo.sport}
        />
      </div>
    );
  } else {
    return (
      <div>
        {/* {scoreCard} */}
        {allMarket}
      </div>
    );
  }
};

export default Market;
