import classes from "./login.module.css";
import React from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../../store/actions/index";
import "alertifyjs/build/css/alertify.css";
import logo from "../../assets/images/logo.png";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  let btnRef = useRef();
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);
  const authRedirectPath = useSelector((state) => state.auth.authRedirectPath);

  const onSubmit = async (data) => {
    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled");
    }

    dispatch(actions.auth(data.username, data.password));
  };

  let errorMessage = null;

  if (error) {
    errorMessage = <p>{error.message}</p>;
  }

  if (isAuthenticated) {
    return <Redirect to={authRedirectPath} />;
  }

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <div className={classes.slidingBackground}></div>
        </div>
        <div className={classes.loginContainer}>
          <div className={classes.formcontent}>
            <div className={classes.logo}>
              <span>
                VR
                <div className={classes.hr} />
              </span>
              <img src={logo} alt="Parkbet999" width="250" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={classes.formgroup}>
                <i className="fa fa-user"></i>
                <input
                  className={classes.inputField}
                  type="text"
                  placeholder="Username"
                  name="username"
                  ref={register({ required: true })}
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <div className={classes.formgroup}>
                <i className="fa fa-lock"></i>
                <input
                  className={classes.inputField}
                  placeholder="Password"
                  name="password"
                  type="password"
                  ref={register({ required: true })}
                />
              </div>
              <div className={classes.formgroup}>
                <button
                  ref={btnRef}
                  disabled={loading}
                  type="submit"
                  className={classes.button}
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
          <div className={classes.loginImage}></div>
          {/* <div className={classes.loginTitle}>Sign In</div>
          <div className={classes.logo}>
            Betfair47.com
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.inputLine}>
              <label className={classes.label}>
                <i className="fas fa-user"></i>
              </label>
              <input
                className={classes.inputField}
                type="text"
                placeholder="Username"
                name="username"
                ref={register({ required: true })}
                autoComplete='off'
                autoFocus />
            </div>
            <div className={classes.inputLine}>
              <label className={classes.label}>
                <i className="fas fa-unlock-alt"></i>
              </label>
              <input
                className={classes.inputField}
                placeholder="Password"
                name="password"
                type="password"
                ref={register({ required: true })} />
            </div>
            <button ref={btnRef} disabled={loading} type="submit" className={classes.button}>Log in</button>
          </form> */}
          {errorMessage}
        </div>
      </div>
    </>
  );
};
export default Login;
