import React, { useState } from "react";
import {
  Button,
  FormControl,
  Input,
  TableCell,
  TableRow,
  InputLabel,
  Switch,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      width: "30px",
      height: "30px",
    },
  },
  buttn: {
    margin: theme.spacing(1),
  },
  form: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
}));

const MarketRow = (props) => {
  const classes = useStyles();
  const [min, setMin] = useState(props.min);
  const [max, setMax] = useState(props.max);
  const [adv_max, setAdvMax] = useState(props.adv_max);

  return (
    <TableRow>
      <TableCell>{props.id}</TableCell>
      <TableCell>{props.name}</TableCell>
      <TableCell>{props.event.toLocaleString("en-IN")}</TableCell>
      <TableCell>
        <Switch
          onChange={props.handleChange}
          checked={props.status}
          color="primary"
          name="checkedB"
        />
      </TableCell>
      <TableCell style={{ display: "flex" }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.buttn}
          onClick={() => {
            props.addRunner(props.id);
          }}
        >
          Runner
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.buttn}
          startIcon={<DeleteIcon />}
          onClick={() => {
            props.deleteMarket(props.id);
          }}
        >
          Delete
        </Button>
      </TableCell>
      <TableCell>
        <div className={classes.form}>
          <FormControl>
            <Input
              name="min"
              type="number"
              onChange={(event) => {
                setMin(event.target.value);
              }}
              value={min}
            />
          </FormControl>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => {
              props.setMinMarket(props.id, min);
            }}
          >
            Set
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className={classes.form}>
          <FormControl>
            <InputLabel htmlFor="max">Inplay</InputLabel>
            <Input
              id="max"
              name="max"
              type="number"
              onChange={(event) => {
                setMax(event.target.value);
              }}
              value={max}
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="max">Advance</InputLabel>
            <Input
              id="adv_max"
              name="adv_max"
              type="number"
              onChange={(event) => {
                setAdvMax(event.target.value);
              }}
              value={adv_max}
            />
          </FormControl>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => {
              props.setMaxMarket(props.id, max, adv_max);
            }}
          >
            Set
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MarketRow;
