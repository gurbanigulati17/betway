import Modal from "../../UI/Modal/Modal";

const Rules = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={"Rules"}
      footer={
        <button className="btn btn-danger" onClick={onClose}>
          Close
        </button>
      }
    >
      <p>
        <strong>
          <span>
            AAJ SE TIED MATCH
            <br />
            ME FANCY KA LEN
            <br />
            DEN KARNGE.
          </span>
        </strong>
        <br />
        1.If you not accept this&nbsp;<strong>agreement&nbsp;</strong>do not
        place any bet.
        <br />
        2.Cheating bets deleted automatically or manual. No Claim.
        <br />
        3.Admin decision is final and no claim on it.
        <br />
        4.&nbsp;
        <strong>
          Batsman Runs (In-Play) Over/Under (back/lay) runs bets will stand
          after batsman has faced one ball or is given out before first ball is
          faced. Score counts if batsman is Not-Out including if innings is
          declared. In case of rain, match abandoned etc. settled bets will be
          valid.
        </strong>
      </p>

      <p>
        <strong>
          5.Current/Next Innings Runs Odd/Even Extras and Penalty runs will be
          included for settlement purposes.
        </strong>
      </p>

      <p>
        <strong>
          6.Runs at Fall of 1st Wicket At least one delivery must be bowled, if
          no wickets fall bets will be void unless settlement is already
          determined.
        </strong>
      </p>

      <p>
        <strong>
          7.Runs at Fall of Next Wicket The total innings runs scored by a team
          before the fall of the specified wicket determines the result of the
          market. If a team declares or reaches their target then the total
          amassed will be the result of the market. Bets will be void should no
          more play take place following the intervention of rain, or any other
          delay, as the ability to reach previous quotes offered will have been
          removed . In case of rain, match abandoned etc. settled bets will be
          valid.
        </strong>
      </p>

      <p>
        <strong>8.</strong>
        <strong>We do not accept manual bet.</strong>
      </p>

      <p>
        <strong>
          9.In case of anyone found using two different IDs logged in same IP
          address his winning in both account will be cancelled.
        </strong>
      </p>

      <p>
        <strong>
          10.In case of cheating and betting in unfair rates we will cancel the
          bet even after settling.
        </strong>
      </p>

      <p>
        <strong>11.Local fancy are based on Haar - Jeet.</strong>
      </p>

      <p>
        <strong>
          12.Incomplete session will be cancelled but complete session will be
          settled.
        </strong>
      </p>

      <p>
        <strong>
          13.In case of match abandoned, cancelled, no result etc. completed
          sessions will be settled.
        </strong>
      </p>

      <p>
        <strong>
          14.Lambi Paari : In 20-20 match entire twenty overs should be bowled,
          in case of rain or any delay if even one over is deducted the bets
          will be cancelled. In One Day match entire 50 overs should be bowled,
          in case of rain or any delay if even one over is deducted the bets
          will be cancelled.
        </strong>
      </p>

      <p>
        <strong>15.Advance Session,Lambi 1`st Inning Valid Only</strong>
      </p>

      <p>
        <strong>
          16.Total Match Four ,Total Match Siixes,Total Match Runs,Total Match
          Wides,Total Match Wicket. If Over Gets Less Then All BET Will Cancel
          This Rule For Limited Over Matches Like 20 Overs And 50 Overs Game
        </strong>
      </p>

      <p>
        <strong>
          17.1st Over Total Runs Prices will be offered for the total runs
          scored during the 1st over of the match. Extras and penalty runs will
          be included. The over must be completed for bets to stand unless
          settlement is already determined.
        </strong>
      </p>

      <p>
        <strong>
          18.Limited Overs Matches - Individual Batsmen Runs or Partnerships In
          a limited overs match where an individual batsman or partnership runs
          are traded in-play and the innings is curtailed or subject to any
          reduction in overs, then these markets will be settled at the midpoint
          of the last available quote before the overs were reduced. If the
          innings resumes at a later time, a new market may be formed. If a
          client wants a position in the new market they are required to place a
          new trade. If there are any subsequent reductions in overs, exactly
          the same rules will continue to apply i.e. the market is settled at
          the midpoint of the last available quote before the overs were reduced
          and a new market may be formed.
        </strong>
      </p>

      <p>
        <strong>
          19.Test Matches - Individual Batsmen Runs / Partnerships All bets,
          open or closed, on an individual batsman or partnership runs shall be
          void if 50 full overs are not bowled unless one team has won, is
          dismissed or declares prior to that point. Bets on partnership totals
          make up when the next wicket falls. If a batsman in the relevant
          partnership retires hurt, the partnership is treated as continuing
          between the remaining batsman and the batsman who comes to the wicket.
          A partnership is also treated as being ended by the end of an innings.
        </strong>
      </p>

      <p>
        <strong>
          20.Due to any technical issue software not work properly at that time
          we are not responsible for any loss.
          <br />
          <br />
          21.KINDLY AVOID JIO INTERNET IN MOBILE WHEN YOU PLACE BET.
        </strong>
      </p>
    </Modal>
  );
};

export default Rules;
