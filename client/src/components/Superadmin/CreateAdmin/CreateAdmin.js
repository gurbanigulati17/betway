import React from "react";
import { Button } from "@material-ui/core";
import axios from "../../../axios-instance/backendAPI";
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object({
  password: yup
    .string()
    .min(
      5,
      <p style={{ color: "red" }}>Password must be atleast 5 characters long</p>
    )
    .required(<p style={{ color: "red" }}>Password required</p>),
});

const CreateAdmin = () => {
  return (
    <div
      style={{
        margin: "2%",
      }}
    >
      <h3>Create Admin</h3>
      <hr />
      <Formik
        validationSchema={schema}
        onSubmit={(data, { resetForm, setSubmitting }) => {
          setSubmitting(true);
          const payload = {
            password: data.password,
          };
          axios
            .post("/superadmin/register", payload)
            .then((response) => {
              if (response.data.success) {
                alert(response.data.message);
                resetForm({
                  password: "",
                });
                setSubmitting(false);
              } else {
                setSubmitting(false);
              }
            })
            .catch((error) => {
              console.log(error);
              resetForm({
                password: "",
              });
              setSubmitting(false);
            });
        }}
        initialValues={{
          password: "",
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
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <input
              type="text"
              defaultValue="Admin"
              readOnly={true}
              autoComplete="off"
              style={{ margin: "10px 0", padding: "6px 4px" }}
            />

            {touched.username && errors.username}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              autoComplete="off"
              style={{ margin: "10px 0", padding: "6px 4px" }}
            />

            {touched.password && errors.password}
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              style={{ width: "100px" }}
            >
              Create
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default CreateAdmin;
