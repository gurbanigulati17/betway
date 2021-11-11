import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "../../../../../axios-instance/backendAPI";
import { Button, Input, InputLabel } from "@material-ui/core";
import { useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

export default function Settlement(props) {
  const dispatch = useDispatch();
  const { handleSubmit } = useForm();
  let btnRef = useRef();

  const onSubmit = () => {
    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled");
    }
    const payload = {
      uplink: props.uplink,
      downlink: props.downlink,
    };
    axios
      .put("/user/settlement", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          alertify.success(response.data.message);
          props.updateRows();
          props.handleClose();
          dispatch(actions.updateBalance());
        } else {
          alertify.error(response.data.message);
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
          <h3>
            Settlement between {props.uplink} and {props.downlink}
          </h3>
        </div>
        <div className="body">
          <InputLabel htmlFor="chips">Chips</InputLabel>
          <Input name="chips" defaultValue={props.chips} disabled />
        </div>

        {/* <Button
                    type="submit"
                    variant='contained'
                    ref={btnRef}
                    style={{ margin: '10px 0' }}
                >Submit</Button> */}
      </form>
    </>
  );
}
