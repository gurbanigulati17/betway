import React, { useEffect, useRef, useState } from "react";
import classes from "../MarketTable.module.css";

export default function OddsBlock(props) {
  const ref = useRef(false);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setHighlight(true);
      setTimeout(() => {
        setHighlight(false);
      }, 300);
    }
    ref.current = true;
  }, [
    props.availableToBack &&
    props.availableToBack[
      props.availableToBack.length - props.num + props.shift
    ] &&
    props.availableToBack[
      props.availableToBack.length - props.num + props.shift
    ].price
      ? props.availableToBack[
          props.availableToBack.length - props.num + props.shift
        ].price
      : null,
    props.availableToBack &&
    props.availableToBack[
      props.availableToBack.length - props.num + props.shift
    ]
      ? props.availableToBack[
          props.availableToBack.length - props.num + props.shift
        ].size
      : null,
  ]);

  return (
    <div
      className={[classes.element, highlight ? classes.highlight : ""].join(
        " "
      )}
    >
      <div className={classes.price}>
        {props.availableToBack &&
        props.availableToBack[
          props.availableToBack.length - props.num + props.shift
        ] &&
        props.availableToBack[
          props.availableToBack.length - props.num + props.shift
        ].price
          ? props.availableToBack[
              props.availableToBack.length - props.num + props.shift
            ].price
          : 0}
      </div>
      <div className={classes.size}>
        {props.availableToBack &&
        props.availableToBack[
          props.availableToBack.length - props.num + props.shift
        ]
          ? props.availableToBack[
              props.availableToBack.length - props.num + props.shift
            ].size > 1000
            ? (
                props.availableToBack[
                  props.availableToBack.length - props.num + props.shift
                ].size / 1000
              ).toFixed(2) + "k"
            : props.availableToBack[
                props.availableToBack.length - props.num + props.shift
              ].size
          : null}
      </div>
    </div>
  );
}
