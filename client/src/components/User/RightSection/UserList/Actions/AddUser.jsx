import React from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import axios from "../../../../../axios-instance/backendAPI";
import { Formik } from "formik";
import * as yup from "yup";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const schema = yup.object({
  username: yup
    .string()
    .required(<p style={{ color: "red" }}>Username required</p>)
    .max(
      10,
      <p style={{ color: "red" }}>
        Username can't be greater than 10 characters
      </p>
    ),
  password: yup
    .string()
    .min(
      5,
      <p style={{ color: "red" }}>Password must be atleast 5 characters long</p>
    )
    .max(
      30,
      <p style={{ color: "red" }}>
        Password must be less than 5 characters long
      </p>
    )
    .required(<p style={{ color: "red" }}>Password required</p>),
  fullname: yup
    .string()
    .required(<p style={{ color: "red" }}>Full name required</p>)
    .max(
      25,
      <p style={{ color: "red" }}>
        Full name can't be greater than 25 characters
      </p>
    ),
});

const users = [
  { type: "Seniorsuper", usertype: "2" },
  { type: "Supermaster", usertype: "3" },
  { type: "Master", usertype: "4" },
  { type: "Client", usertype: "5" },
];

const NewUser = (props) => {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={(data, { setErrors, resetForm, setSubmitting }) => {
        if (data.username.length > 10) {
          setErrors({
            username: (
              <p style={{ color: "red" }}>
                Username must be atmost 10 characters length
              </p>
            ),
          });
        }
        if (data.username.includes(" ")) {
          setErrors({
            username: (
              <p style={{ color: "red" }}>
                Username must not contain white spaces
              </p>
            ),
          });
        } else {
          axios
            .get("/user/doesUserExists/" + data.username, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            })
            .then((response) => {
              if (response.data.message === "Invalid Token...") {
                return;
              }

              if (response.data.data.length) {
                setErrors({
                  username: (
                    <p style={{ color: "red" }}>Username already exists</p>
                  ),
                });
                setSubmitting(false);
              } else {
                setSubmitting(true);
                const payload = {
                  downlink: data.username,
                  uplink: props.uplink,
                  password: data.password,
                  fullname: data.fullname,
                  usertype: props.usertype,
                };
                axios
                  .post("/user", payload, {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  })
                  .then((response) => {
                    if (response.data.success) {
                      alertify.success(response.data.message);
                      props.updateRows();
                      resetForm({
                        username: "",
                        passsword: "",
                        fullname: "",
                      });
                      props.handleClose();
                    } else {
                      setErrors({
                        password: (
                          <span style={{ color: "red" }}>
                            {response.data.message}
                          </span>
                        ),
                      });
                    }
                    setSubmitting(false);
                  })
                  .catch((error) => {
                    console.log(error);
                    setSubmitting(false);
                  });
              }
            })
            .catch((error) => {
              console.log(error);
              setSubmitting(false);
            });
        }
      }}
      initialValues={{
        username: "",
        password: "",
        fullname: "",
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
            <h3>
              Add{" "}
              {users
                .filter((obj) => {
                  return String(obj.usertype) === String(props.usertype);
                })
                .map((obj) => obj.type)}{" "}
              for - {props.uplink}
            </h3>
          </div>
          <div className="body">
            <Grid
              className={props.gridy}
              container
              spacing={1}
              justify="space-between"
            >
              <Grid item xs={6}>
                <TextField
                  label="Username"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  autoFocus
                />
                {touched.username && errors.username}
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
              <Grid item xs={6}>
                <TextField
                  label="Fullname"
                  variant="outlined"
                  size="small"
                  name="fullname"
                  onChange={handleChange}
                  value={values.fullname}
                />
                {touched.fullname && errors.fullname}
              </Grid>
            </Grid>
          </div>
          <div className="footer">
            <button
              disabled={isSubmitting}
              color="primary"
              style={{ marginRight: 10 }}
              className="btn btn-primary btn-extra"
            >
              Add
            </button>
            <button
              onClick={props.handleClose}
              className="btn btn-secondary btn-extra"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default NewUser;
