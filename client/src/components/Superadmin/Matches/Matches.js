import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../../axios-instance/backendAPI";
import classes from "./Matches.module.css";
import Select from "react-select";
import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
  TableContainer,
  Switch,
} from "@material-ui/core";
import Modal from "../../UI/Modal/Modal";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Delete from "./Delete";
import Add from "./Add";
import Timer from "./Timer";

const styleButton = {
  margin: "5px 10px",
};
const options = [
  { value: "4", label: "Cricket" },
  { value: "1", label: "Soccer" },
  { value: "2", label: "Tennis" },
];

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  table: {
    minWidth: 650,
  },
}));

const Matches = () => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const history = useHistory();
  const classesButton = useStyles();
  const [matches, setMatches] = useState([]);
  const [sport, setSport] = useState({ value: "4", label: "Cricket" });
  const [activeId, setActiveId] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteMatch, setDelete] = useState(false);
  const [add, setAdd] = useState(false);
  const [timer, setTimer] = useState(false);

  function hideModal() {
    setShow(false);
  }
  function handleChange(sport) {
    setSport(sport);
  }
  function handleSubmit() {
    if (!sport.value) {
      alert("Please select a sport");
    }
    getMatches();
  }

  useEffect(() => {
    getMatches();
    return () => {
      // ComponentWillUnmount in Class Component
      _isMounted.current = false;
    };
  }, []);
  function showDelete(matchId) {
    setDelete(true);
    setAdd(false);
    setShow(true);
    setTimer(false);
    setActiveId(matchId);
  }
  function showTimer(matchId) {
    setTimer(true);
    setDelete(false);
    setAdd(false);
    setShow(true);
    setActiveId(matchId);
  }
  function showAdd(matchId) {
    setAdd(true);
    setDelete(false);
    setShow(true);
    setTimer(false);
    setActiveId(matchId);
  }
  function getMatches() {
    if (sport.value) {
      axios
        .get("/superadmin/getMatches/" + sport.value, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("a_token"),
          },
        })
        .then((response) => {
          response.data.result.forEach((match) => {
            if (match.status === "on") {
              match.status = true;
            } else {
              match.status = false;
            }
          });
          setMatches(response.data.result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  function handleSwitchChange(id) {
    const payload = {
      id: id,
    };
    axios
      .put("/superadmin/toggleMatch", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("a_token") },
      })
      .then((response) => {
        getMatches();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  let matchRow = null,
    toRender = null;

  if (deleteMatch) {
    toRender = (
      <Delete
        eventId={activeId}
        hideModal={hideModal}
        getMatches={getMatches}
      />
    );
  } else if (timer) {
    toRender = (
      <Timer eventId={activeId} hideModal={hideModal} getMatches={getMatches} />
    );
  } else if (add) {
    toRender = <Add eventId={activeId} hideModal={hideModal} />;
  }

  if (matches.length) {
    matchRow = matches.map((match) => {
      let event = new Date(match.openDate);
      return (
        <TableRow key={match.id}>
          <TableCell>{match.id}</TableCell>
          <TableCell>{match.name}</TableCell>
          <TableCell>
            {match.cupRate === match.id ? (
              <span>
                <i className="fas fa-trophy" />
                Cup Rate
              </span>
            ) : (
              event.toLocaleString("en-IN")
            )}
          </TableCell>
          <TableCell
            style={{ cursor: "pointer" }}
            onClick={() => {
              showTimer(match.id);
            }}
          >
            {match.timer}s
          </TableCell>
          <TableCell>
            <Switch
              onChange={() => {
                handleSwitchChange(match.id);
              }}
              checked={match.status}
              color="primary"
              name="checkedB"
            />
          </TableCell>
          <TableCell>
            <Button
              variant="contained"
              onClick={() => {
                history.push("/superadmin/market/" + match.id);
              }}
            >
              See
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                showAdd(match.id);
              }}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classesButton.button}
              startIcon={<DeleteIcon />}
              onClick={() => {
                showDelete(match.id);
              }}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  } else {
    matchRow = (
      <TableRow>
        <TableCell colSpan="6">No data</TableCell>
      </TableRow>
    );
  }
  return (
    <div>
      <Modal open={show} onClose={hideModal}>
        {toRender}
      </Modal>
      <div className={classes.nav}>
        <Select
          id="sport"
          value={sport}
          onChange={handleChange}
          options={options}
        />
        <Button variant="contained" style={styleButton} onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <div style={{ margin: "0 10px" }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>Match Name</TableCell>
                <TableCell>Open Date</TableCell>
                <TableCell>Timer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>All Markets</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{matchRow}</TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Matches;
