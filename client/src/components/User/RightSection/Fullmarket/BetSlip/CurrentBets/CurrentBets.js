import React, { useState, useEffect, useRef } from "react";
import axios from "../../../../../../axios-instance/backendAPI";
import { useSelector } from "react-redux";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const CurrentBets = (props) => {
  const usertype = useSelector((state) => state.auth.usertype);
  const currentBets = useSelector((state) => state.update.currentBets);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const gridOptions = {
    // all even rows assigned 'my-shaded-effect'
    getRowStyle: (params) => {
      if (params.node.data.selection === "back") {
        return { backgroundColor: "#b0d8f5" };
      } else {
        return { backgroundColor: "#f9c2ce" };
      }
    },

    // other grid options ...
  };

  const ref = useRef();
  const users = [
    { type: "seniorsuper", usertype: "2" },
    { type: "supermaster", usertype: "3" },
    { type: "master", usertype: "4" },
  ];

  const getCurrentBets = () => {
    if (props.eventId) {
      let url = "/user/getCurrentBetsByEvent/";
      if (props.type === "fancy") {
        url = "/user/getFancyBetsByEvent/";
      }
      axios
        .get(url + props.eventId, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((response) => {
          if (response.data.success) {
            const options = {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            };

            response.data.data = response.data.data.map((row) => {
              return {
                username: row.username,
                odds: row.odds,
                stake: row.stake,
                runner:
                  row.runner +
                  (row.type === "fancy"
                    ? "/" + row.user_rate
                    : "/" + row.market),
                bet_id: row.bet_id,
                selection: row.selection,
                seniorsuper: row.seniorsuper,
                supermaster: row.supermaster,
                master: row.master,
                IP_Address: row.IP_Address,
                placed_at: new Date(row.placed_at).toLocaleDateString(
                  "en-IN",
                  options
                ),
              };
            });
            setRowData(response.data.data);
            props.handleNoOfBets(response.data.data.length);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getCurrentBets();
    if (usertype !== "5") {
      ref.current = setInterval(getCurrentBets, 12000);
    }
    return () => {
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    };
  }, [props.eventId, currentBets]);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        onGridReady={onGridReady}
        gridOptions={gridOptions}
        rowData={rowData}
      >
        {props.myUsertype === "5" ? null : (
          <AgGridColumn
            field="username"
            width={135}
            sortable={true}
            filter={true}
          ></AgGridColumn>
        )}
        <AgGridColumn field="odds" width={90} sortable={true}></AgGridColumn>
        <AgGridColumn field="stake" width={90} sortable={true}></AgGridColumn>
        <AgGridColumn
          field="runner"
          width={330}
          sortable={true}
          filter={true}
        ></AgGridColumn>
        <AgGridColumn field="bet_id" width={90} sortable={true}></AgGridColumn>
        {users
          .filter(
            (user) => parseFloat(user.usertype) > parseFloat(props.myUsertype)
          )
          .map((user) => {
            return (
              <AgGridColumn
                field={user.type}
                width={120}
                key={user.usertype}
                sortable={true}
              ></AgGridColumn>
            );
          })}
        <AgGridColumn
          field="IP_Address"
          width={235}
          sortable={true}
        ></AgGridColumn>
        <AgGridColumn
          field="placed_at"
          width={330}
          sortable={true}
        ></AgGridColumn>
      </AgGridReact>
      {/* <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>BetId</TableCell>
                        {props.myUsertype === '5' ? null : <TableCell>Username</TableCell>}
                        <TableCell>Runner</TableCell>
                        <TableCell>Odds</TableCell>
                        <TableCell>Stake</TableCell>
                        {users.filter(user => parseFloat(user.usertype) > parseFloat(props.myUsertype)
                        ).map(user => {
                            return <TableCell key={user.usertype}>
                                {user.type}
                            </TableCell>
                        })}
                        <TableCell>IP_Address</TableCell>
                        <TableCell>Placed_At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {row}
                </TableBody>
            </Table> */}
    </div>
  );
};

export default CurrentBets;
