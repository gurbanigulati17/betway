import React, { useRef } from "react";
import classes from "./ChangePassword.module.css";
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom'
import axios from "../../../axios-instance/backendAPI";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

export default function ChangePassword() {
  const { register, handleSubmit, errors, watch } = useForm();
  const password = useRef({});
  const history = useHistory();
  password.current = watch("newpassword", "");
  const onSubmit = (data) => {
    const payload = {
      old_password: data.oldpassword,
      new_password: data.newpassword
    }
    axios.put('/superadmin/changePassword', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
      .then(response => {
        if (response.data.success) {
          localStorage.removeItem('a_token')
          localStorage.removeItem('Super_IP')
          history.push('/superadmin/login')
          alertify.success(response.data.message);
        }
        else {
          alertify.error(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      })
  }
  return (
    <div className={classes.root}>
      <div className={classes.helper}>Change Password</div>
      <div className={classes.changepass}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.table}>
            <div className={classes.label}>
              <label>Old Password* </label>
            </div>
            <input
              name="oldpassword"
              type="password"
              className={classes.materialUIInput}
              ref={register({
                required: "You must specify a password"
              })}
              autoComplete="off"
              autoFocus
            />
            <br />

          </div>
          {errors.oldpassword && <p className={classes.p}>{errors.oldpassword.message}</p>}
          <div className={classes.table}>
            <div className={classes.label}>
              <label>New Password* </label>
            </div>
            <input
              name="newpassword"
              type="password"
              className={classes.materialUIInput}
              ref={register({
                required: "You must specify a password",
                minLength: {
                  value: 5,
                  message: "Password must have at least 5 characters"
                }
              })}
              autoComplete="off"

            />
            <br />

          </div>
          {errors.newpassword && <p className={classes.p}>{errors.newpassword.message}</p>}
          <div className={classes.table}>
            <div className={classes.label}>
              <label>Retype New Password* </label>
            </div>
            <input
              name="retypenewpassword"
              type="password"
              className={classes.materialUIInput}
              ref={register({
                validate: value =>
                  value === password.current || "The passwords do not match"
              })}
              autoComplete="off"
            />
            <br />

          </div>
          {errors.retypenewpassword && <p className={classes.p}>{errors.retypenewpassword.message}</p>}
          <div className={classes.button}>
            <input className={classes.input} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}