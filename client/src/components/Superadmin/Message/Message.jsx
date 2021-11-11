import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../../axios-instance/backendAPI";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    width: "80px",
  },
}));

const Message = () => {
  const classes = useStyles();
  const [message, setMessage] = useState("");

  function changeHandler(event) {
    if (event.target.value.length >= 200) {
      alertify.error("Length cannot exceed 200 characters");
      return;
    }

    setMessage(event.target.value);
  }
  function handleSubmit() {
    if (!message.length) {
      alertify.error("Please enter a message");
      return;
    }

    const payload = {
      message: message,
    };
    axios
      .post("/superadmin/setMessage", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        if (response.data.success) {
          setMessage("");
          alertify.success(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div
      style={{
        margin: "2%",
      }}
    >
      <h2>Enter message to send to client:</h2>
      <form>
        <textarea
          rows="8"
          cols="25"
          style={{
            padding: "2%",
            fontSize: "1.5rem",
          }}
          name="message"
          onChange={changeHandler}
          value={message}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default Message;
