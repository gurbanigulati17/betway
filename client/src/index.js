import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import authReducer from "./store/reducers/auth";
import updateReducer from "./store/reducers/update";
import theme from "./styles/theme";

(function () {
  (function a() {
    try {
      (function b(i) {
        if (("" + i / i).length !== 1 || i % 20 === 0) {
          if (process.env.NODE_ENV !== "development") {
            (function () {}.constructor("debugger")());
          }
        } else {
          if (process.env.NODE_ENV !== "development") {
            debugger;
          }
        }
        b(++i);
      })(0);
    } catch (e) {
      setTimeout(a, 5000);
    }
  })();
})();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  update: updateReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
