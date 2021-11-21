import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import axios from "../../../../../axios-instance/backendAPI";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "block",
    boxSizing: "border-box",
    width: "250px",
    borderRadius: "0",
    backgroundColor: "white",
    padding: "10px",
    fontSize: "14px",
    border: "solid 1px #ddd",
  },
}));

export default function Delete(props) {
  const { register, handleSubmit, errors, setError } = useForm();
  const classes = useStyles();
  const onSubmit = (data) => {
    axios
      .delete("/user/delete/" + props.username + "/" + data.password, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.message === "Invalid Token...") {
          return;
        }

        if (response.data.success) {
          alertify.success(response.data.message);
          props.updateRows();
          props.handleClose();
        } else {
          setError("password", {
            type: "manual",
            message: (
              <span style={{ color: "red" }}>{response.data.message}</span>
            ),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="head">
          <h3>Are u sure u want to delete {props.username}?</h3>
        </div>
        <div className="body">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            ref={register({
              required: (
                <span style={{ color: "red" }}>
                  You must specify a password
                </span>
              ),
            })}
            className={classes.input}
            autoFocus
          />

          {errors.password && <p>{errors.password.message}</p>}

          <p>
            Note: All downlinks along with their records will be deleted too!
          </p>
        </div>
        <div className="footer">
          <button
            type="submit"
            variant="contained"
            className="btn btn-primary btn-extra"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
