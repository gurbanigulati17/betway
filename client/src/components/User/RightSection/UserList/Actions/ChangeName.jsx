import React from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import axios from "../../../../../axios-instance/backendAPI";
import { Formik } from "formik";
import * as yup from "yup";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { makeStyles } from "@material-ui/core/styles";

import appTheme from "../../../../../styles/theme";

const ChangeName = (props) => {
  const classes = useStyles();
  const schema = yup.object({
    name: yup
      .string()
      .required(<p style={{ color: "red" }}>New fullname required</p>),
    password: yup
      .string()
      .required(<p style={{ color: "red" }}>Password required</p>),
  });

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(data, { setErrors, setSubmitting }) => {
        setSubmitting(true);

        const payload = {
          username: props.username,
          name: data.name,
          password: data.password,
        };

        axios
          .patch("user/changeFullname", payload, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            if (response.data.success) {
              alertify.success(response.data.message);
              props.handleClose();
              props.updateRows();
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
        name: "",
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
            <h3>Change Fullname</h3>
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
                  label="New Fullname"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  type="text"
                  autoFocus
                />
                {touched.name && errors.name}
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
          </div>
          <div className="footer">
            <Button
              disabled={isSubmitting}
              type="submit"
              variant="contained"
              color="primary"
              className="btn btn-info"
            >
              Submit
            </Button>
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
}));

export default ChangeName;
