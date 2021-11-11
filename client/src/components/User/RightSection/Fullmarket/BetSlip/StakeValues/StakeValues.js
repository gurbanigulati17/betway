import React, { useState, useEffect } from "react";
import { FormControl, Button, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../../../../../axios-instance/backendAPI";
import { Formik } from "formik";
import * as yup from "yup";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

import appTheme from "../../../../../../styles/theme";

const useStyles = makeStyles((theme) => ({
  btn: {
    display: "flex",
    margin: "15px 0 5px",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    display: "flex",
    justifyContent: "space-evenly",
    margin: "5px 0",
  },
  headBox: {
    display: "flex",
    justifyContent: "space-evenly",
    margin: "5px 0",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "space-between",
    },
  },
  Heading: {
    textAlign: "left",
    backgroundColor: appTheme.colors.primary,
    color: "white",
    fontWeight: "700",
    padding: "10px",
    margin: "-8px -8px 0 -8px",
    textTransform: "uppercase",
  },
  head: {
    color: "black",
    padding: "6px 12px",
    fontWeight: "700",
  },
}));

const schema = yup.object({
  label1: yup
    .string()
    .min(1, <p style={{ color: "red" }}>Label can't be null</p>)
    .max(12, <p style={{ color: "red" }}>Length can't exceed 12 characters</p>)
    .required(<p style={{ color: "red" }}>Label needed</p>),
  label2: yup
    .string()
    .min(1, <p style={{ color: "red" }}>Label can't be null</p>)
    .max(12, <p style={{ color: "red" }}>Length can't exceed 12 characters</p>)
    .required(<p style={{ color: "red" }}>Label needed</p>),
  label3: yup
    .string()
    .min(1, <p style={{ color: "red" }}>Label can't be null</p>)
    .max(12, <p style={{ color: "red" }}>Length can't exceed 12 characters</p>)
    .required(<p style={{ color: "red" }}>Label needed</p>),
  label4: yup
    .string()
    .min(1, <p style={{ color: "red" }}>Label can't be null</p>)
    .max(12, <p style={{ color: "red" }}>Length can't exceed 12 characters</p>)
    .required(<p style={{ color: "red" }}>Label needed</p>),
  label5: yup
    .string()
    .min(1, <p style={{ color: "red" }}>Label can't be null</p>)
    .max(12, <p style={{ color: "red" }}>Length can't exceed 12 characters</p>)
    .required(<p style={{ color: "red" }}>Label needed</p>),
  label6: yup
    .string()
    .min(1, <p style={{ color: "red" }}>Label can't be null</p>)
    .max(12, <p style={{ color: "red" }}>Length can't exceed 12 characters</p>)
    .required(<p style={{ color: "red" }}>Label needed</p>),
  value1: yup
    .number()
    .min(10, <p style={{ color: "red" }}>Value should be atleast 10</p>)
    .max(
      99999.99,
      <p style={{ color: "red" }}>Value1 must be smaller than 1,00,000</p>
    )
    .required(<p style={{ color: "red" }}>Value needed</p>),
  value2: yup
    .number()
    .min(10, <p style={{ color: "red" }}>Value should be atleast 10</p>)
    .max(
      99999.99,
      <p style={{ color: "red" }}>Value2 must be smaller than 1,00,000</p>
    )
    .required(<p style={{ color: "red" }}>Value needed</p>),
  value3: yup
    .number()
    .min(10, <p style={{ color: "red" }}>Value should be atleast 10</p>)
    .max(
      99999.99,
      <p style={{ color: "red" }}>Value3 must be smaller than 1,00,000</p>
    )
    .required(<p style={{ color: "red" }}>Value needed</p>),
  value4: yup
    .number()
    .min(10, <p style={{ color: "red" }}>Value should be atleast 10</p>)
    .max(
      99999.99,
      <p style={{ color: "red" }}>Value4 must be smaller than 1,00,000</p>
    )
    .required(<p style={{ color: "red" }}>Value needed</p>),
  value5: yup
    .number()
    .min(10, <p style={{ color: "red" }}>Value should be atleast 10</p>)
    .max(
      999999.99,
      <p style={{ color: "red" }}>Value5 must be smaller than 10,00,000</p>
    )
    .required(<p style={{ color: "red" }}>Value needed</p>),
  value6: yup
    .number()
    .min(10, <p style={{ color: "red" }}>Value should be atleast 10</p>)
    .max(
      999999.99,
      <p style={{ color: "red" }}>Value6 must be smaller than 10,00,000</p>
    )
    .required(<p style={{ color: "red" }}>Value needed</p>),
});

const StakeValues = (props) => {
  const classes = useStyles();
  const [stakes, setStakes] = useState(null);

  useEffect(() => {
    axios
      .get("/user/getStakes", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setStakes(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let myForm = null;

  if (stakes) {
    myForm = (
      <Formik
        validationSchema={schema}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          const payload = {
            label1: data.label1,
            value1: data.value1,
            label2: data.label2,
            value2: data.value2,
            label3: data.label3,
            value3: data.value3,
            label4: data.label4,
            value4: data.value4,
            label5: data.label5,
            value5: data.value5,
            label6: data.label6,
            value6: data.value6,
          };
          axios
            .put("/user/setStakes", payload, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            })
            .then((response) => {
              if (response.data.success) {
                props.onClose();
                if (props.changeStakeChanged) {
                  props.changeStakeChanged();
                }
                alertify.success(response.data.message);
              }
              setSubmitting(false);
            })
            .catch((error) => {
              setSubmitting(false);
              alert(error);
              console.log(error);
            });
        }}
        initialValues={{
          label1: stakes[0].label,
          value1: stakes[0].stake,
          label2: stakes[1].label,
          value2: stakes[1].stake,
          label3: stakes[2].label,
          value3: stakes[2].stake,
          label4: stakes[3].label,
          value4: stakes[3].stake,
          label5: stakes[4].label,
          value5: stakes[4].stake,
          label6: stakes[5].label,
          value6: stakes[5].stake,
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          isSubmitting,
        }) => (
          <form>
            <p className={classes.Heading}>
              Change default stake button values
            </p>
            <div className={classes.headBox}>
              <div className={classes.head}> Label </div>
              <div className={classes.head}> Stakes </div>
            </div>
            <div className={classes.box}>
              <FormControl>
                <Input
                  type="text"
                  name="label1"
                  value={values.label1}
                  onChange={handleChange}
                />
                {touched.label1 && errors.label1}
              </FormControl>
              <FormControl>
                <Input
                  type="number"
                  name="value1"
                  value={values.value1}
                  onChange={handleChange}
                />
                {touched.value1 && errors.value1}
              </FormControl>
            </div>
            <div className={classes.box}>
              <FormControl>
                <Input
                  type="text"
                  name="label2"
                  value={values.label2}
                  onChange={handleChange}
                />
                {touched.label2 && errors.label2}
              </FormControl>
              <FormControl>
                <Input
                  type="number"
                  name="value2"
                  value={values.value2}
                  onChange={handleChange}
                />
                {touched.value2 && errors.value2}
              </FormControl>
            </div>
            <div className={classes.box}>
              <FormControl>
                <Input
                  type="text"
                  name="label3"
                  value={values.label3}
                  onChange={handleChange}
                />
                {touched.label3 && errors.label3}
              </FormControl>
              <FormControl>
                <Input
                  type="number"
                  name="value3"
                  value={values.value3}
                  onChange={handleChange}
                />
                {touched.value3 && errors.value3}
              </FormControl>
            </div>
            <div className={classes.box}>
              <FormControl>
                <Input
                  type="text"
                  name="label4"
                  value={values.label4}
                  onChange={handleChange}
                />
                {touched.label4 && errors.label4}
              </FormControl>
              <FormControl>
                <Input
                  type="number"
                  name="value4"
                  value={values.value4}
                  onChange={handleChange}
                />
                {touched.value4 && errors.value4}
              </FormControl>
            </div>
            <div className={classes.box}>
              <FormControl>
                <Input
                  type="text"
                  name="label5"
                  value={values.label5}
                  onChange={handleChange}
                />
                {touched.label5 && errors.label5}
              </FormControl>
              <FormControl>
                <Input
                  type="number"
                  name="value5"
                  value={values.value5}
                  onChange={handleChange}
                />
                {touched.value5 && errors.value5}
              </FormControl>
            </div>
            <div className={classes.box}>
              <FormControl>
                <Input
                  type="text"
                  name="label6"
                  value={values.label6}
                  onChange={handleChange}
                />
                {touched.label6 && errors.label}
              </FormControl>
              <FormControl>
                <Input
                  type="number"
                  name="value6"
                  value={values.value6}
                  onChange={handleChange}
                />
                {touched.value6 && errors.value6}
              </FormControl>
            </div>
            <div className={classes.btn}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isSubmitting}
                className="btn btn-success"
              >
                Update
              </Button>
            </div>
          </form>
        )}
      </Formik>
    );
  }

  return <div>{myForm}</div>;
};

export default StakeValues;
