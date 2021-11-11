import axios from "../../axios-instance/backendAPI";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import * as actionTypes from "./actionTypes";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, username, usertype) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    username: username,
    usertype: usertype,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("IP");
  return {
    type: actionTypes.AUTH_LOGOUT,
    path: "/login",
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (username, password) => {
  return async (dispatch) => {
    dispatch(authStart());

    let response = {};
    if (username.toLowerCase() !== "admin") {
      try {
        response = await axios.get(
          "https://ipapi.co/json?key=" + process.env.REACT_APP_KEY
        );
      } catch (err) {
        alertify.error("IP Address not found! Please try again");
        dispatch(authFail(err));
        return;
      }
    } else {
      response.data = {};
    }

    const authData = {
      username: username,
      password: password,
      IP_Address: response.data.ip,
      name: response.data.org,
      region: response.data.region,
      city: response.data.city,
      country: response.data.country_name,
    };
    let url = "/user/login";

    axios
      .post(url, authData)
      .then((response) => {
        if (response.data.success) {
          alertify.success(response.data.message);
          localStorage.setItem("token", response.data.token);
          dispatch(
            authSuccess(response.data.token, username, response.data.usertype)
          );
          dispatch(checkAuthTimeout(response.data.expiresIn));
          dispatch(setAuthRedirectPath("/dashboard"));
        } else {
          alertify.error(response.data.message);
          dispatch(authFail(response.data.message));
        }
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      let url = "/user/authCheck";

      axios
        .get(url, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((response) => {
          if (response.data.success) {
            // // if (response.data.data[0].isExpired) {
            // //     dispatch(logout());
            // // } else {
            // //     dispatch(authSuccess(localStorage.getItem('token'), response.data.data[0].username, response.data.data[0].usertype));
            // //     dispatch(checkAuthTimeout((response.data.data[0].timer) / 1000));
            // }
            dispatch(
              authSuccess(
                localStorage.getItem("token"),
                response.data.data[0].username,
                response.data.data[0].usertype
              )
            );
            dispatch(checkAuthTimeout(response.data.data[0].timer / 1000));
          } else {
            if (response.data.password_changed) {
              localStorage.setItem("pc", 1);
              return dispatch(setAuthRedirectPath("/changePassword"));
            }
            dispatch(logout());
          }
        })
        .catch((err) => {
          dispatch(authFail(err));
        });
    }
  };
};
