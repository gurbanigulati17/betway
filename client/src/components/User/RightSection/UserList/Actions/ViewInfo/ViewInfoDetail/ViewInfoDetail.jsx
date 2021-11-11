import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import classes from "./ViewInfoDetail.module.css";
import { useForm } from "react-hook-form";
import axios from "../../../../../../../axios-instance/backendAPI";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

export default function ViewInfoDetail(props) {

  const { register, handleSubmit, errors } = useForm();
  const [limitRisk, setLimitRisk] = useState({});
  const [defaultChecked, setDefaultChecked] = useState(false);
  const [updateAll, setUpdateAll] = useState(false);

  const changeDefaultChecked = () => {
    setDefaultChecked((prevState) => {
      return !prevState;
    });
  };

  const changeUpdateAll = () => {
    setUpdateAll((prevState) => {
      return !prevState;
    });
  };

  const onSubmit = (data) => {
    let sport = [
      { type: "5", name: "Fancy" },
      { type: "4", name: "Cricket" },
      { type: "1", name: "Soccer" },
      { type: "2", name: "Tennis" },
    ];
    data.username = props.username;
    data.event_type = sport.filter((obj) => obj.name === props.info)[0]?.type;
    data.default = defaultChecked;
    data.all = updateAll;

    let url = "/user/limitRisk";

    if (props.info === "Fancy") {
      url = "/user/limitFancyRisk";
    } else if (props.info === 'Commission') {
      url = '/user/setCommission'
    }

    axios
      .put(url, data, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.success) {
          props.updateRows()
          props.handleClose()
          alertify.success(response.data.message)
        } else {
          alertify.error(response.data.message)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let sport = [
      { type: "5", name: "Fancy" },
      { type: "4", name: "Cricket" },
      { type: "1", name: "Soccer" },
      { type: "2", name: "Tennis" },
    ];

    sport = sport.filter((obj) => obj.name === props.info);

    if (sport.length) {
      let url;

      if (defaultChecked) {
        url = "/user/getDefaultConstraints/";
      } else {
        url = "/user/allConstraints/";
      }

      axios
        .get(url + props.username + "/" + sport[0]?.type, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((response) => {
          if (response.data.success) {
            setLimitRisk(response.data.data[0]);
          } else {
            alertify.success(response.data.message);
            changeDefaultChecked();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [defaultChecked, props.info, props.username]);

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.infohead}>{props.info}</div>
        <div className={classes.flexinfo}>
          {props.info === "User" ? (
            <div className={classes.personinfo}>
              <label className={classes.label}>Username</label>
              <input
                type="text"
                className={classes.input}
                name="Username"
                defaultValue={props.username}
                disabled
              />
            </div>
          ) : props.info === 'Commission' ?
              <div className={classes.personinfo}>
                <label className={classes.label}>Commission</label>
                <input
                  type="text"
                  className={classes.input}
                  name="Commission"
                  ref={register({
                    required: true,
                  })}
                  defaultValue={props.commission}
                />
              </div> :
              (
                <>
                  <div className={classes.personinfo}>
                    <label className={classes.label}>MIN STAKE</label>
                    <input
                      type="text"
                      className={classes.input}
                      name="min_stake"
                      defaultValue={limitRisk.min_stake}
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.min_stake && (
                      <p className={classes.p}>You must specify a min stake</p>
                    )}
                  </div>
                  <div className={classes.personinfo}>
                    <label className={classes.label}>MAX STAKE</label>
                    <input
                      type="text"
                      className={classes.input}
                      name="max_stake"
                      defaultValue={limitRisk.max_stake}
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.max_stake && (
                      <p className={classes.p}>You must specify a max stake</p>
                    )}
                  </div>
                  <div className={classes.personinfo}>
                    <label className={classes.label}>MAX Profit</label>
                    <input
                      type="text"
                      className={classes.input}
                      name="max_profit"
                      defaultValue={limitRisk.max_profit}
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.max_profit && (
                      <p className={classes.p}>You must specify a max profit</p>
                    )}
                  </div>
                  <div className={classes.personinfo}>
                    <label className={classes.label}>BET DELAY</label>
                    <input
                      type="text"
                      className={classes.input}
                      name="timer"
                      defaultValue={limitRisk.timer}
                      ref={register({
                        required: true,
                      })}
                    />
                    {errors.timer && (
                      <p className={classes.p}>You must specify a Bet Delay</p>
                    )}
                  </div>
                  {props.info === "Fancy" ? null : (
                    <>
                      <div className={classes.personinfo}>
                        <label className={classes.label}>PRE INPLAY PROFIT</label>
                        <input
                          type="text"
                          className={classes.input}
                          name="adv_max_profit"
                          defaultValue={limitRisk.adv_max_profit}
                          ref={register({
                            required: true,
                          })}
                        />
                        {errors.adv_max_profit && (
                          <p className={classes.p}>
                            You must specify pre inplay profit
                          </p>
                        )}
                      </div>
                      <div className={classes.personinfo}>
                        <label className={classes.label}>PRE INPLAY STAKE</label>
                        <input
                          type="text"
                          className={classes.input}
                          name="adv_max_stake"
                          defaultValue={limitRisk.adv_max_stake}
                          ref={register({
                            required: true,
                          })}
                        />
                        {errors.adv_max_stake && (
                          <p className={classes.p}>
                            You must specify pre inplay stake
                          </p>
                        )}
                      </div>
                      <div className={classes.personinfo}>
                        <label className={classes.label}>MIN ODDS</label>
                        <input
                          type="text"
                          className={classes.input}
                          name="min_odds"
                          defaultValue={limitRisk.min_odds}
                          ref={register({
                            required: true,
                          })}
                        />
                        {errors.min_odds && (
                          <p className={classes.p}>You must specify min odds</p>
                        )}
                      </div>

                      <div className={classes.personinfo}>
                        <label className={classes.label}>MAX ODDS</label>
                        <input
                          type="text"
                          className={classes.input}
                          name="max_odds"
                          defaultValue={limitRisk.max_odds}
                          ref={register({
                            required: true,
                          })}
                        />
                        {errors.max_odds && (
                          <p className={classes.p}>You must specify max odds</p>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
        </div>
        {props.info === "Commission" ? <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Update
            </Button> :
          props.info === "User" ?
            null : (
              <>
                <div style={{ display: "flex" }}>
                  <div style={{ margin: "10px 20px 8px 0px" }}>
                    <label>Get default Value</label>
                    <input
                      type="checkbox"
                      checked={defaultChecked}
                      onChange={changeDefaultChecked}
                    />
                  </div>
                  <div style={{ margin: "10px 20px 8px 0px" }}>
                    <label>Update for all</label>
                    <input
                      type="checkbox"
                      checked={updateAll}
                      onChange={changeUpdateAll}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Update
            </Button>
              </>
            )}
      </form>
    </div>
  );
}
