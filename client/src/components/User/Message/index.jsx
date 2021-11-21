import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import withStyles from "../../../styles";
import axios from "../../../axios-instance/backendAPI";

import styles from "./styles";

const Message = ({ className }) => {
  const [message, setMessage] = useState("");
  const messageUpdate = useSelector((state) => state.update.message);

  const getMessage = () => {
    axios
      .get("/user/getMessage", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getMessage();
  }, [messageUpdate]);

  return (
    <div className={className}>
      <strong className="news">
        <i className="fa fa-microphone"></i> News
      </strong>
      <marquee speed={0.1}>{message}</marquee>
    </div>
  );
};

export default withStyles(Message, styles);
