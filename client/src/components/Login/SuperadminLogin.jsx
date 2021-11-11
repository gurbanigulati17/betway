import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import classes from "./login.module.css";
import React from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../axios-instance/backendAPI";
import logo from "../../assets/images/logo.png";

const Login = (props) => {
  const { register, handleSubmit } = useForm();
  let btnRef = useRef();

  const onSubmit = async (data) => {
    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled");
    }

    let IP_Address = null;
    try {
      const ipRes = await axios.get("https://ipapi.co/json");
      IP_Address = ipRes.data.ip;
      localStorage.setItem("Super_IP", IP_Address);
    } catch (err) {
      console.log(err);
      alertify.error("IP Address not found! Please try again");
      return;
    }

    const ip = localStorage.getItem("Super_IP");
    const payload = {
      password: data.password,
      client_ip: ip,
      time: new Date(),
    };

    axios
      .post("/superadmin/login", payload)
      .then((res) => {
        if (res.data.success) {
          alertify.success(res.data.message);
          localStorage.setItem("a_token", res.data.token);
          props.history.push("/superadmin");
        } else {
          btnRef.current.removeAttribute("disabled");
          alertify.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        <div className={`${classes.loginContainer}`}>
          <div className={`${classes.formcontent}`}>
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
                  name="username"
                  defaultValue="Superadmin"
                  disabled
                  className={classes.inputField}
                  type="text"
                  placeholder="Username"
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
              <button ref={btnRef} type="submit" className={classes.button}>
                Log in
              </button>
            </form>
          </div>
          <div className={classes.loginImage}></div>
        </div>
      </div>
    </>
  );
};
export default Login;
