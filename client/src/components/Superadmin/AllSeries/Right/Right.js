import React, { Component } from 'react';
import axios from '../../../../axios-instance/backendAPI';
import odds_axios from '../../../../axios-instance/oddsApi';
import SeriesRow from './RightRow'
import { Table, Button, TableCell, TableRow, TableHead, TableBody, TableContainer, Paper } from '@material-ui/core';
import Modal from '../../../UI/Modal/Modal'
import classes from './Right.module.css';
import Select from 'react-select';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const styleButton = {
    margin: '5px 2px'
}
const options = [
    { value: "4", label: "Cricket" },
    { value: "1", label: "Soccer" },
    { value: "2", label: "Tennis" }
];
class Series extends Component {

    state = {
        existing: [],
        existDisable: false,
        addDisable: false,
        disableUpdate: false,
        currentId: null,
        seriesInfo: false,
        allSeries: true,
        new: [],
        matches: [],
        activeId: null,
        sport: { value: null, label: 'Select Sport' },
        show: false
    }
    hideModal = () => {
        this.setState({ show: false });
    }
    showModal = (id) => {
        this.setState({ show: true, activeId: id });

        axios.get('/superadmin/getSeriesMatches/' + id, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                this.setState({ matches: response.data.result });
            })
            .catch(error => {
                console.log(error);
            })
    }
    handleChange = (sport) => {
        this.setState({ sport: sport });
    }
    handleSubmit = () => {
        if (!this.state.sport.value) {
            alert('Please select a sport');
            return
        }
        this.setState({ allSeries: true })
        this.getExistingSeries();
        this.getCurrentSeries();
    }
    componentDidMount() {
        this.getExistingSeries()
        this.getCurrentSeries()
    }
    getExistingSeries() {

        if (this.state.sport.value) {

            axios.get('/superadmin/existingSeries/' + this.state.sport.value, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                .then(response => {
                    this.setState({ existing: response.data.result })
                })
                .catch(error => {
                    console.log(error);
                })
        }

    }
    getCurrentSeries() {
        if (this.state.sport.value) {

            odds_axios.get('/getSeries/' + this.state.sport.value)
                .then(response => {
                    this.setState({ new: response.data.data })
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }
    addSeries(id, name, competitionRegion) {
        this.setState({ addDisable: true, currentId: id });
        const payload = {
            id: id,
            name: name,
            sport: this.state.sport.value,
            competitionRegion: competitionRegion
        }
        axios.post('/superadmin/addSeries', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                if (response.data.success) {
                    alertify.success(response.data.message);
                    this.componentDidMount();
                    this.setState({ addDisable: false });
                } else {
                    alertify.error(response.data.message);
                }
            })
            .catch(error => {
                this.setState({ addDisable: false });
                console.log(error);
            })
    }
    removeSeries(id) {
        this.setState({ existDisable: true, currentId: id });

        axios.delete('/superadmin/removeSeries/' + id, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                if (response.data.success) {
                    alertify.success(response.data.message);
                    this.componentDidMount();
                    this.setState({ existDisable: false });
                } else {
                    alertify.error(response.data.message);
                }
            })
            .catch(error => {
                this.setState({ existDisable: false });
                console.log(error);
            })
    }
    updateMatch = () => {

        this.setState({ disableUpdate: true });
        axios.put('/superadmin/updateMatch', {}, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                if (response.data.success) {
                    alertify.success(response.data.message);
                } else {
                    alertify.error(response.data.message);
                }
                this.setState({ disableUpdate: false });
            })
            .catch(error => {
                this.setState({ disableUpdate: false });
                console.log(error);
            })
    }
    submitForm = (event) => {
        event.preventDefault();
        const payload = {
            cupRate: event.target.matches.value,
            id: this.state.activeId
        }
        axios.put('/superadmin/setCupRate', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
            .then(response => {
                if (response.data.success) {
                    alertify.success(response.data.message);
                } else {
                    alertify.error(response.data.message);
                }
                this.setState({ show: false });
            })
            .catch(error => {
                console.log(error);
            })
    }
    render() {

        let existingSeries = null, newSeries = null, allMatches = null, form = null, toRender;
        if (this.state.existing.length) {
            existingSeries = this.state.existing.map(series => {
                return (
                    <SeriesRow
                        key={series.id}
                        id={series.id}
                        name={series.name}
                        competitionRegion={series.competitionRegion}
                        disable={this.state.currentId === series.id ? this.state.existDisable : false}
                        action={() => { this.removeSeries(series.id) }}
                        sign='-'
                        showModal={() => { this.showModal(series.id) }}
                    />)
            })
        }
        else {
            existingSeries = <TableRow><TableCell colSpan='4'>No data</TableCell></TableRow>
        }

        if (this.state.new.length) {
            newSeries = this.state.new;
            this.state.existing.forEach(existingSeries => {
                let index = newSeries.findIndex(series => series.competition.id === existingSeries.id);
                if (index !== -1)
                    newSeries.splice(index, 1);
            })
            newSeries = newSeries.map(series => {
                return (<SeriesRow
                    key={series.competition.id}
                    id={series.competition.id}
                    name={series.competition.name}
                    competitionRegion={series.competitionRegion}
                    disable={this.state.currentId === series.competition.id ? this.state.addDisable : false}
                    action={() => {
                        this.addSeries(series.competition.id, series.competition.name, series.competitionRegion)
                    }}
                    sign='+'
                />)
            })
        }
        else {
            newSeries = <TableRow><TableCell colSpan='4'>No data</TableCell></TableRow>
        }

        if (this.state.matches.length) {
            allMatches = this.state.matches.map(match => {
                return (
                    <div
                        key={match.id}
                    >
                        <input
                            type="radio"
                            id={match.id}
                            name='matches'
                            value={match.id}
                            defaultChecked={match.id === match.cupRate}
                        />
                        <label htmlFor={match.id}>{match.name}</label>
                    </div>)
            })
            form = (<form
                onSubmit={this.submitForm}
                style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
                <h4>Select Cup Rate</h4>
                {allMatches}
                <Button type='submit'>Submit</Button>
            </form>)
        }

        if (this.state.allSeries) {
            toRender = <>
                <div>
                    <span style={{ margin: '0 10px' }}>Click on this button to update all existing series</span>
                    <Button onClick={this.updateMatch} variant='contained' style={{ margin: '0 10px' }} disabled={this.state.disableUpdate}>Update</Button>
                </div>
                <div style={{ margin: '0 10px' }}>
                    <h3>Existing Series</h3>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>id</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Competition Region</TableCell>
                                    <TableCell>Remove</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {existingSeries}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div style={{ margin: '10px' }}>
                    <h3>Add new Series</h3>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>id</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Competition Region</TableCell>
                                    <TableCell>Add</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {newSeries}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </>
        }

        return (
            <div className={classes.Right}>
                <Modal open={this.state.show} onClose={this.hideModal}>
                    {form}
                </Modal>
                <div className={classes.nav}>
                    <Select
                        id='sport'
                        value={this.state.sport}
                        onChange={this.handleChange}
                        options={options}
                    />
                    <Button
                        variant="contained" color="primary"
                        style={styleButton}
                        onClick={this.handleSubmit}
                    >Submit
                      </Button>
                </div>
                {toRender}
            </div>
        )
    }
}

export default Series