import React, { useRef } from "react";
import classes from "./ChangePassword.module.css";
import { useForm } from "react-hook-form";
import axios from "../../../../../../axios-instance/backendAPI";

export default function ChangePassword(props) {
  const { register, handleSubmit, errors, watch } = useForm();
  const password = useRef({});
  password.current = watch("newpassword", "");
  const onSubmit = (data) => {
    const payload = {
      username: props.username,
      password: data.password,
      new_password: data.newpassword,
    };
    axios
      .put("/user/resetPassword", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          props.handleClose();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="head">
        <h3>Change Password</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="body">
          <div className={classes.table}>
            <div className={classes.label}>
              <label>New Password* </label>
            </div>
            <div className={classes.field}>
              <input
                name="newpassword"
                type="password"
                className={classes.materialUIInput}
                ref={register({
                  required: "You must specify a password",
                  minLength: {
                    value: 5,
                    message: "Password must have at least 5 characters",
                  },
                })}
                autoComplete="off"
                autoFocus
              />
              {errors.newpassword && (
                <p className={classes.p}>{errors.newpassword.message}</p>
              )}
            </div>
          </div>
          <div className={classes.table}>
            <div className={classes.label}>
              <label>Confirm Password* </label>
            </div>
            <div className={classes.field}>
              <input
                name="confirmpassword"
                type="password"
                className={classes.materialUIInput}
                ref={register({
                  validate: (value) =>
                    value === password.current || "The passwords do not match",
                })}
                autoComplete="off"
              />
              {errors.confirmpassword && (
                <p className={classes.p}>{errors.confirmpassword.message}</p>
              )}
            </div>
          </div>

          <div className={classes.table}>
            <div className={classes.label}>
              <label>Password* </label>
            </div>
            <div className={classes.field}>
              <input
                name="password"
                type="password"
                className={classes.materialUIInput}
                ref={register({
                  required: "You must specify a password",
                })}
                autoComplete="off"
              />
              {errors.password && (
                <p className={classes.p}>{errors.password.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="submit" className="btn btn-danger">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
