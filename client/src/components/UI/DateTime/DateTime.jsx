import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: 0,
    marginRight: theme.spacing(2.5),
    width: 240,
    marginBottom: 20,
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
      <FormControl component="fieldset" className={classes.form}>
        <FormLabel className={classes.heading}>{props.name}</FormLabel>
        <RadioGroup
          row
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}
        >
          {props.filter.map((obj) => {
            return (
              <FormControlLabel
                value={obj.value}
                control={<Radio />}
                label={obj.label}
                key={obj.value}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      <div className={classes.container}>
        <TextField
          name="from"
          label="From"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          value={from}
          onChange={handleFromChange}
          className={classes.textField}
        />
        <TextField
          name="to"
          label="To"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleToChange}
          value={to}
          className={classes.textField}
        />
      </div>
    </>
  );
}
