import React, { useEffect, useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
} from "@material-ui/core";
import axios from "../../../../../axios-instance/backendAPI";
import { Formik } from "formik";
import * as yup from "yup";
import TableCell from "@material-ui/core/TableCell";
import { useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { makeStyles } from "@material-ui/core/styles";

import appTheme from "../../../../../styles/theme";

const Deposit = (props) => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();

  const schema = yup.object({
    chips: yup
      .number()
      .required(<p style={{ color: "red" }}>Free chips required</p>)
      .min(
        1,
        <p style={{ color: "red" }}>Free chips must be greater than 1</p>
      ),
    password: yup
      .string()
      .required(<p style={{ color: "red" }}>Password required</p>),
  });

  useEffect(() => {
    axios
      .get("/user/userBalanceInfo/" + props.uplink, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        setUserInfo(response.data.data[0]);
        if (response.data.message === "Invalid Token...") {
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.uplink]);

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(data, { setErrors, resetForm, setSubmitting }) => {
        setSubmitting(true);

        if (userInfo.balance !== undefined && userInfo.balance < data.chips) {
          setErrors({
            chips: (
              <span style={{ color: "red" }}>
                Free chips must be smaller than upline balance
              </span>
            ),
          });
          setSubmitting(false);
          return;
        }

        const payload = {
          uplink: props.uplink,
          downlink: props.downlink,
          uplink_type: props.uplink_type,
          downlink_type: props.downlink_type,
          money: data.chips,
          password: data.password,
        };

        axios
          .patch("/user/deposit", payload, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            if (response.data.success) {
              alertify.success(response.data.message);
              props.updateRows();
              dispatch(actions.updateBalance());
              resetForm({
                chips: "",
                passsword: "",
              });
              props.handleClose();
            } else {
              setErrors({
                password: (
                  <span style={{ color: "red" }}>{response.data.message}</span>
                ),
              });
            }
            setSubmitting(false);
          })
          .catch((error) => {
            console.log(error);
            setSubmitting(false);
          });
      }}
      initialValues={{
        chips: "",
        password: "",
      }}
    >
      {({
        handleSubmit,
        handleChange,
        isSubmitting,
        values,
        touched,
        errors,
      }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="head">
            <h3>Deposit</h3>
          </div>
          <div className="body">
            <Grid
              className={props.gridy}
              container
              spacing={1}
              justify="space-between"
              style={{ marginTop: 10 }}
            >
              <Grid item xs={12}>
                <TextField
                  label="Free chips"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  value={values.chips}
                  name="chips"
                  type="number"
                />
                {touched.chips && errors.chips}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Password"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  type="password"
                />
                {touched.password && errors.password}
              </Grid>
            </Grid>
            <TableContainer className={classes.tableContainer}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.tdTitle}>
                      {props.uplink_type === "1"
                        ? "Coins_generated"
                        : props.uplink + " Free Chips"}
                    </TableCell>
                    <TableCell>
                      {props.uplink_type === "1"
                        ? props.coins_generated
                        : userInfo.balance}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tdTitle}>
                      {props.downlink} Balance
                    </TableCell>
                    <TableCell>{props.userBalance}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tdTitle}>
                      {props.uplink_type === "1"
                        ? " New Coins_generated"
                        : props.uplink + " New Free Chips"}
                    </TableCell>
                    <TableCell>
                      {props.uplink_type === "1"
                        ? props.coins_generated + values.chips
                        : userInfo.balance - values.chips}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tdTitle}>
                      {props.downlink} New Balance
                    </TableCell>
                    <TableCell>{props.userBalance + values.chips}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="footer">
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-primary btn-extra"
            >
              Deposit
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

const useStyles = makeStyles((theme) => ({
  titlePanel: {
    background: appTheme.colors.primary,
    color: appTheme.colors.textLight,
    fontWeight: 700,
    border: 0,
    margin: "-8px -8px 20px -8px",
    minHeight: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  title: {
    marginRight: "10px",
    fontSize: 14,
    fontFamily: "inherit",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  tdTitle: {
    font: "700 14px Tahoma, Helvetica, sans-serif",
    color: "#243a48",
    padding: "8px 10px",
    position: "relative",
    borderBottom: "solid 1px #CCC",
    backgroundColor: "#e4e4e4",
    width: "50%",
  },
  tableContainer: {
    marginTop: 30,
  },
}));

export default Deposit;
