import React, { useRef } from "react";
import classes from "./ChangePassword.module.css";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import axios from "../../../../axios-instance/backendAPI";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import * as actions from "../../../../store/actions/index";

export default function ChangePassword() {
  const { register, handleSubmit, errors, watch } = useForm();
  const dispatch = useDispatch();
  const password = useRef({});
  password.current = watch("newpassword", "");
  const onSubmit = (data) => {
    const payload = {
      pass_me: true,
      old_password: data.oldpassword,
      new_password: data.newpassword,
    };
    axios
      .put("/user/changePassword", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          localStorage.removeItem("pc");
          dispatch(actions.logout());
          alertify.success(response.data.message);
        } else {
          alertify.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className={classes.paper}>
      <div className={classes.helper}>Change Password</div>
      <div className={classes.changepass}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.table}>
            <div className={classes.label}>
              <label>Old Password* </label>
            </div>
            <div className={classes.field}>
              <input
                name="oldpassword"
                type="password"
                className={classes.materialUIInput}
                ref={register({
                  required: "You must specify a password",
                })}
                autoComplete="off"
                autoFocus
              />
              {errors.oldpassword && (
                <p className={classes.p}>{errors.oldpassword.message}</p>
              )}
            </div>
          </div>

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
              />
              {errors.newpassword && (
                <p className={classes.p}>{errors.newpassword.message}</p>
              )}
            </div>
          </div>

          <div className={classes.table}>
            <div className={classes.label}>
              <label>Retype New Password* </label>
            </div>
            <div className={classes.field}>
              <input
                name="retypenewpassword"
                type="password"
                className={classes.materialUIInput}
                ref={register({
                  validate: (value) =>
                    value === password.current || "The passwords do not match",
                })}
                autoComplete="off"
              />
              {errors.retypenewpassword && (
                <p className={classes.p}>{errors.retypenewpassword.message}</p>
              )}
            </div>
          </div>
          <div className={classes.table}>
            <div className={classes.label}></div>
            <div className={classes.submit}>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
