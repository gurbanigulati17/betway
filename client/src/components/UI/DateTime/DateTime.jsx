import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { TextField } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      width: "100%",
    },
  },
  seperator: {
    display: "inline-flex",
    marginRight: 15,
    marginBottom: 15,
    fontWeight: 700,
    fontSize: 14,
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      textAlign: "center",
      width: "100%",
      display: "block",
    },
  },
  textField: {
    marginRight: 15,
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      width: "100%",
    },
  },
  button: {
    marginTop: "10px",
  },
  heading: {
    fontWeight: "bold",
  },
}));
export default function DateTime(props) {
  let myDate = new Date();
  let dd = String(myDate.getDate()).padStart(2, "0");
  let mm = String(myDate.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = myDate.getFullYear();

  let today = yyyy + "-" + mm + "-" + dd + " 00:00:00";
  let tomorrow = yyyy + "-" + mm + "-" + dd + " 23:59:59";

  const classes = useStyles();
  const [from, setFrom] = useState(
    props.dateCache
      ? props.dateCache.from
      : moment(today).format("YYYY-MM-DDTHH:mm:ss")
  );
  const [to, setTo] = useState(
    moment(props.dateCache ? props.dateCache.to : tomorrow).format(
      "YYYY-MM-DDTHH:mm:ss"
    )
  );
  const [value, setValue] = React.useState("All");
  const username = useSelector((state) => state.auth.username);

  const handleToChange = (event) => {
    setTo(event.target.value);
  };
  const handleFromChange = (event) => {
    setFrom(event.target.value);
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    props.onSubmit(from, to, value);
  }, [from, to, value, username, props.userInfo ? props.userInfo : null]);

  return (
    <>
      <div className={classes.container}>
        <TextField
          name="from"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          value={from}
          onChange={handleFromChange}
          className={`${classes.textField} formInputWrapper`}
        />
        <span className={classes.seperator}>To</span>
        <TextField
          name="to"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleToChange}
          value={to}
          className={`${classes.textField} formInputWrapper`}
        />
      </div>
      {!!props.filter?.length && (
        <select
          value={value}
          onChange={handleChange}
          className="formInputTheme"
        >
          {props.filter.map((obj) => {
            return (
              <option value={obj.value} key={obj.value}>
                {obj.label}
              </option>
            );
          })}
        </select>
      )}
    </>
  );
}
