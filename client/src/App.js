import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login/login";
import Layout from "./components/User/User";
import SuperadminLogin from "./components/Login/SuperadminLogin";
import Superadmin from "./components/Superadmin/Superadmin";
import SplashScreen from "./components/SplashScreen";
import GlobalStyle from "./styles/global";

const App = () => {
  useEffect(() => {
    const stopContextMenu = (e) => {
      if (process.env.NODE_ENV !== "development") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", stopContextMenu);

    return () => document.removeEventListener("contextmenu", stopContextMenu);
  }, []);

  useEffect(() => {
    const stopContextMenu = (e) => {
      if (process.env.NODE_ENV !== "development") {
        if (e.keyCode === 123) {
          return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode === "I".charCodeAt(0)) {
          return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode === "C".charCodeAt(0)) {
          return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode === "J".charCodeAt(0)) {
          return false;
        }
        if (e.ctrlKey && e.keyCode === "U".charCodeAt(0)) {
          return false;
        }
      }
    };

    document.addEventListener("keydown", stopContextMenu);

    return () => document.removeEventListener("keydown", stopContextMenu);
  }, []);

  return (
    <>
      <GlobalStyle />
      <SplashScreen>
        <BrowserRouter>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route exact path="/superadmin/login" component={SuperadminLogin} />
            <Route path="/superadmin" component={Superadmin} />
            <Route path="/" component={Layout} />
          </Switch>
        </BrowserRouter>
      </SplashScreen>
    </>
  );
};

export default App;
