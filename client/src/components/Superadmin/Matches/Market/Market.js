import React, { Component } from 'react';
import { Button, Table, TableRow, TableCell, TableBody, TableHead, TableContainer, Paper } from '@material-ui/core';
import Modal from '../../../UI/Modal/Modal'
import axios from '../../../../axios-instance/backendAPI';
import odds_axios from '../../../../axios-instance/oddsApi';
import MarketRow from './MarketRow';
import FancyMarketRow from './FancyMarketRow';
import Timer from './Timer';
import Delete from './Delete';
import Add from './Add';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

class Market extends Component {

    state = {
        markets: [],
        allMarkets: [],
        fancyMarket: [],
        show: false,
        add: false,
        delete: false,
        marketId: false,
        bookmakerFlag: false
    }
    hideModal = () => {
        this.setState({ show: false });
    }
    componentDidMount() {
        this.getMarkets();
        this.getFancyMarket();
    }
    addMarket = () => {

        const payload = {
            id: this.props.match.params.id
        }
        axios.post('/superadmin/addMarket', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                alertify.success(response.data.message)
                this.getMarkets()
            })
            .catch(error => {
                console.log(error);
            })
    }
    addBookmakerMarket = () => {

        const payload = {
            id: this.props.match.params.id
        }
        axios.post('/superadmin/addBookmakerMarket', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                alertify.success(response.data.message)
                this.getMarkets()
            })
            .catch(error => {
                console.log(error);
            })
    }
    deleteMarket = (id) => {
        this.setState({ add: false, delete: true, timer: false, marketId: id, show: true })
    }
    timer = () => {
        this.setState({ add: false, delete: false, timer: true, show: true })
    }
    addRunner = (id) => {
        this.setState({ add: true, delete: false, timer: false, show: true, marketId: id })
    }
    getMarkets = () => {

        axios.get('/superadmin/getMarketsByMatch/' + this.props.match.params.id, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {

                response.data.data.forEach(market => {
                    if (market.status === 'on') {
                        market.status = true;
                    }
                    else {
                        market.status = false;
                    }
                });
                this.setState({ markets: response.data.data },
                    this.checkMissingMarkets)
            })
            .catch(error => {
                console.log(error);
            })
    }
    checkMissingMarkets = () => {

        this.checkBookmaker()
        let existingMarkets = this.state.markets.map(market => {
            return market.id
        })

        odds_axios.get('/getMarkets/' + this.props.match.params.id)
            .then(response => {

                let currentMarkets = response.data.data.map(market => {
                    return market.marketId
                })

                let obj = {}

                existingMarkets.forEach((e, index) => {
                    obj[e] = index
                })

                let check = currentMarkets.every((e) => {
                    return obj[e] !== undefined
                })

                if (!check) {
                    this.setState({ missing: true })
                }
                else {
                    this.setState({ missing: false })
                }
            })
            .catch(error => {
                console.log(error);
            })

    }
    checkBookmaker = () => {

        let existingMarkets = this.state.markets.map(market => {
            return market.id
        })

        odds_axios.get('/getBookmakerMarket/' + this.props.match.params.id)
            .then(response => {
                if (response.data.success) {

                    if (response.data.data.length) {

                        const index = existingMarkets.findIndex(market => market === response.data.data[0].marketId)
                        if (index === -1)
                            this.setState({ bookmakerFlag: 1 })
                        else
                            this.setState({ bookmakerFlag: 0 })

                    }
                }
            })
            .catch(error => {
                console.log(error);
            })

    }
    getFancyMarket = () => {

        axios.get('/superadmin/getFancyMarket/' + this.props.match.params.id, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                if (response.data.result.length) {
                    if (response.data.result[0].status === 'on') {
                        response.data.result[0].status = true;
                    }
                    else {
                        response.data.result[0].status = false;
                    }
                    this.setState({ fancyMarket: response.data.result })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    handleSwitchChange(id) {

        const payload = {
            id: id,
            eventId: this.props.match.params.id
        }
        axios.put('/superadmin/toggleMarket', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                this.getMarkets();
            })
            .catch(error => {
                console.log(error);
            })
    }
    handleFancySwitchChange() {

        const payload = {
            id: this.props.match.params.id
        }
        axios.put('/superadmin/toggleFancyMarket', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                this.getFancyMarket();
            })
            .catch(error => {
                console.log(error);
            })
    }
    setMaxMarket = (id, max, adv_max) => {

        if (max <= 0) {
            alert('Please provide a valid value');
            return;
        }

        const payload = {
            id: id,
            eventId: this.props.match.params.id,
            max: max,
            adv_max: adv_max
        }
        axios.post('/superadmin/setMaxMarket', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                if (response.data.success) {
                    alertify.success(response.data.message);
                    this.getMarkets();
                } else {
                    alertify.error(response.data.message);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    setMinMarket = (id, min) => {

        if (min <= 0) {
            alert('Please provide a valid value');
            return;
        }

        const payload = {
            id: id,
            eventId: this.props.match.params.id,
            min: min
        }
        axios.post('/superadmin/setMinMarket', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                if (response.data.success) {
                    alertify.success(response.data.message);
                    this.getMarkets();
                } else {
                    alertify.error(response.data.message);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    setFancyMinMarket = (min) => {

        if (min <= 0) {
            alert('Please provide a valid value');
            return;
        }

        const payload = {
            id: this.props.match.params.id,
            min: min
        }
        axios.post('/superadmin/setFancyMinMarket', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                alert(response.data.result)
                this.getFancyMarket();
            })
            .catch(error => {
                console.log(error);
            })
    }
    setFancyMaxMarket = (max) => {

        if (max <= 0) {
            alert('Please provide a valid value');
            return;
        }

        const payload = {
            id: this.props.match.params.id,
            max: max
        }
        axios.post('/superadmin/setFancyMaxMarket', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                alert(response.data.result)
                this.getFancyMarket();
            })
            .catch(error => {
                console.log(error);
            })
    }
    render() {

        let allMarkets = null, fancyRow = null, toRender = null;

        if (this.state.timer) {
            toRender = <Timer
                eventId={this.props.match.params.id}
                hideModal={this.hideModal}
                getFancyMarket={this.getFancyMarket}
            />
        }
        else if (this.state.delete) {
            toRender = <Delete
                marketId={this.state.marketId}
                eventId={this.props.match.params.id}
                getMarkets={this.getMarkets}
                hideModal={this.hideModal}
            />
        }
        else if (this.state.add) {
            toRender = <Add
                marketId={this.state.marketId}
                eventId={this.props.match.params.id}
                hideModal={this.hideModal}
            />
        }

        if (this.state.markets.length) {

            allMarkets = this.state.markets.map(market => {
                let event = new Date(market.marketStartTime);
                return (<MarketRow
                    key={market.id}
                    id={market.id}
                    name={market.name}
                    event={event}
                    min={market.min}
                    max={market.max}
                    adv_max={market.adv_max}
                    status={market.status}
                    handleChange={() => { this.handleSwitchChange(market.id) }}
                    setMaxMarket={this.setMaxMarket}
                    setMinMarket={this.setMinMarket}
                    deleteMarket={this.deleteMarket}
                    addRunner={this.addRunner}
                />)

            })
        }
        else {
            allMarkets = <TableRow><TableCell colSpan='6'>No data</TableCell></TableRow>
        }

        if (this.state.fancyMarket.length) {

            fancyRow = (
                <FancyMarketRow
                    id={this.props.match.params.id}
                    min={this.state.fancyMarket[0].min}
                    max={this.state.fancyMarket[0].max}
                    timer={this.state.fancyMarket[0].timer}
                    status={this.state.fancyMarket[0].status}
                    handleChange={() => { this.handleFancySwitchChange() }}
                    setFancyMaxMarket={this.setFancyMaxMarket}
                    setFancyMinMarket={this.setFancyMinMarket}
                    showModal={this.timer}
                />
            )
        }

        return (
            <div style={{ top: '115px', position: 'relative' }}>
                <Modal open={this.state.show} onClose={this.hideModal}>
                    {toRender}
                </Modal>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Market Start Time</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                                <TableCell>Minimum</TableCell>
                                <TableCell>Maximum</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allMarkets}
                            {fancyRow}
                        </TableBody>
                    </Table>
                </TableContainer>
                {this.state.missing ?
                    <p>You are missing some markets! Click this button to add
                        <Button
                            variant='contained'
                            onClick={this.addMarket}
                        >Add</Button>
                    </p> :
                    null}
                {this.state.bookmakerFlag ?
                    <p>Bookmaker available! Click this button to add
                        <Button
                            variant='contained'
                            onClick={this.addBookmakerMarket}
                        >Add</Button>
                    </p> :
                    null}
            </div>
        )
    }
}

export default Market;