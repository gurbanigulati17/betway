import React, { useEffect, useRef, useState } from "react";
import classes from "../MarketTable.module.css";

export default function OddsBlock(props) {
  const ref = useRef(false);
  const [highlight, setHighlight] = useState(false);

  useEffect(
    () => {
      if (ref.current) {
        setHighlight(true);
        setTimeout(() => {
          setHighlight(false);
        }, 300);
      }
      ref.current = true;
    },
    [
      props.availableToBack &&
      props.availableToBack[
        props.availableToBack.length - props.bnum + props.shift
      ] &&
      props.availableToBack[
        props.availableToBack.length - props.bnum + props.shift
      ].price
        ? props.availableToBack[
            props.availableToBack.length - props.bnum + props.shift
          ].price
        : null,
      props.availableToBack &&
      props.availableToBack[
        props.availableToBack.length - props.bnum + props.shift
      ]
        ? props.availableToBack[
            props.availableToBack.length - props.bnum + props.shift
          ].size
        : null,
    ],
    [
      props.availableToLay &&
      props.availableToLay[props.num] &&
      props.availableToLay[props.num].price
        ? props.availableToLay[props.num].price
        : null,
      props.availableToLay && props.availableToLay[props.num]
        ? props.availableToLay[props.num].size
        : null,
    ]
  );

  if (props.marketName.toLowerCase() === "bookmaker") {
    return (
      <div
        className={[classes.element, highlight ? classes.highlight : ""].join(
          " "
        )}
      >
        <div className={classes.price}>
          {props.availableToBack &&
          props.availableToBack[
            props.availableToBack.length - props.bnum + props.shift
          ] &&
          props.availableToBack[
            props.availableToBack.length - props.bnum + props.shift
          ].price
            ? props.availableToBack[
                props.availableToBack.length - props.bnum + props.shift
              ].price > 1
              ? parseFloat(
                  (
                    props.availableToBack[
                      props.availableToBack.length - props.bnum + props.shift
                    ].price + 0.01
                  ).toFixed(2)
                )
              : props.availableToBack[
                  props.availableToBack.length - props.bnum + props.shift
                ].price
            : 0}
        </div>
        <div className={classes.size}>
          {props.availableToLay && props.availableToLay[props.num]
            ? props.availableToLay[props.num].size > 1000
              ? (props.availableToLay[props.num].size / 1000).toFixed(2) + "k"
              : props.availableToLay[props.num].size
            : null}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={[classes.element, highlight ? classes.highlight : ""].join(
          " "
        )}
      >
        <div className={classes.price}>
          {props.availableToLay &&
          props.availableToLay[props.num] &&
          props.availableToLay[props.num].price
            ? props.availableToLay[props.num].price
            : 0}
        </div>
        <div className={classes.size}>
          {props.availableToLay && props.availableToLay[props.num]
            ? props.availableToLay[props.num].size > 1000
              ? (props.availableToLay[props.num].size / 1000).toFixed(2) + "k"
              : props.availableToLay[props.num].size
            : null}
        </div>
      </div>
    );
  }
}
