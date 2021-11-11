import React from 'react';
import { Formik } from 'formik';
import { FormControl, Button, InputLabel, Input } from '@material-ui/core';
import axios from '../../../axios-instance/backendAPI';
import * as yup from 'yup';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const schema = yup.object({
    password: yup.string()
        .required(<p style={{ color: 'red' }}>Password required</p>),
    runner: yup.string(),
    void: yup.boolean()
});

const MatchRunners = (props) => {

    return <Formik
        validationSchema={schema}
        onSubmit={(data, { setErrors, resetForm, setSubmitting }) => {
            setSubmitting(true);
            if (data.void) {
                const payload = {
                    eventId: props.eventId,
                    marketId: props.marketId,
                    password: data.password,
                    type: 'exchange'
                }
                if (props.marketName.toLowerCase() === 'bookmaker') {
                    payload.type = 'bookmaker'
                }
                axios.put('/superadmin/voidMatch', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                    .then(response => {
                        if (response.data.success) {
                            alertify.success(response.data.message);
                            resetForm({
                                password: '',
                                runner: '',
                                void: false
                            })
                            setSubmitting(false)
                            props.hideModal()
                            props.getMatches()
                        }
                        else {
                            setSubmitting(false);
                            setErrors({ password: <p style={{ color: 'red' }}>{response.data.message}</p> });
                        }

                    })
                    .catch(error => {
                        setSubmitting(false);
                        alert(error)
                        console.log(error);
                        props.hideModal()
                        resetForm({
                            password: '',
                            runner: '',
                            void: false
                        })
                    })
            } else {

                let winner = props.runners.filter(runner => runner.selectionId === data.runner)
                let winnerName = winner[0].name

                if (data.runner !== '') {
                    const payload = {
                        eventId: props.eventId,
                        marketId: props.marketId,
                        winner: data.runner,
                        winnerName: winnerName,
                        password: data.password,
                        type: 'exchange'
                    }
                    if (props.marketName === 'Bookmaker') {
                        payload.type = 'bookmaker'
                    }
                    axios.put('/superadmin/settleMatch', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                        .then(response => {
                            if (response.data.success) {
                                alertify.success(response.data.message);
                                props.hideModal()
                                props.getMatches();
                                resetForm({
                                    password: '',
                                    runner: '',
                                    void: false
                                })
                                setSubmitting(false);
                            }
                            else {
                                setSubmitting(false);
                                setErrors({ password: <p style={{ color: 'red' }}>{response.data.message}</p> });
                            }
                        })
                        .catch(error => {
                            alert(error)
                            console.log(error)
                            resetForm({
                                password: '',
                                runner: '',
                                void: false
                            })
                            setSubmitting(false)
                            props.hideModal()
                        })
                }
                else {
                    setSubmitting(false);
                    setErrors({ runner: <p style={{ color: 'red' }}>Runner required</p> });
                    return
                }
            }
        }
        }
        initialValues={{
            password: '',
            runner: '',
            void: false
        }
        }
    >
        {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
            isSubmitting
        }) => {
            let allRunners = props.runners.map(runner => {
                return (
                    <FormControl
                        key={runner.selectionId}
                        style={{ display: values.void ? 'none' : 'block' }}
                    >
                        <input
                            type="radio"
                            id={runner.selectionId}
                            name='runner'
                            value={runner.selectionId}
                            onChange={handleChange}
                        />
                        <label
                            size='sm'
                            htmlFor={runner.selectionId}
                            style={{ fontSize: '15px', margin: '0 3px' }}
                        >{runner.name}</label>
                    </FormControl>)
            })
            return (<form onSubmit={handleSubmit}>
                <FormControl
                    style={{ display: 'block' }}>
                    <input
                        id="void"
                        type="checkbox"
                        name="void"
                        value={values.void}
                        defaultChecked={false}
                        onChange={handleChange}
                    />
                    <label htmlFor='void'>void</label>
                    {touched.void && errors.void}
                </FormControl>
                {allRunners}
                {touched.runner && errors.runner}
                <FormControl style={{ display: 'block' }}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                    />
                    {touched.password && errors.password}
                </FormControl>
                <Button type="submit" variant='contained' disabled={isSubmitting}>Submit</Button>
            </form>)
        }}
    </Formik>
}
export default MatchRunners;