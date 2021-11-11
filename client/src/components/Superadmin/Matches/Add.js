import React from 'react';
import { FormControl, Button, InputLabel, Input, Paper } from '@material-ui/core';
import axios from '../../../axios-instance/backendAPI';
import { Formik } from 'formik';
import * as yup from 'yup';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const schema = yup.object({

    password: yup.string()
        .required(<p style={{ color: 'red' }}>New password required</p>),
    name: yup.string()
        .required(<p style={{ color: 'red' }}>Market name required</p>),
    min: yup.number()
        .required(<p style={{ color: 'red' }}>Minimum value required</p>)
        .min(0, <p style={{ color: 'red' }}>Minimum must be greater than 0</p>),
    max: yup.number()
        .required(<p style={{ color: 'red' }}>Maximum value required</p>)
        .max(1000000, <p style={{ color: 'red' }}>Maximum must be smaller than 1000000</p>),
    adv_max: yup.number()
        .required(<p style={{ color: 'red' }}>Advance maximum value required</p>)
        .max(1000000, <p style={{ color: 'red' }}>Maximum must be smaller than 1000000</p>),
});

const ChangePassword = (props) => {
    return (
        <Formik
            validationSchema={schema}
            onSubmit={(data, { setErrors, resetForm, setSubmitting }) => {

                setSubmitting(true);

                data.eventId = props.eventId
                data.date = new Date()
                axios.post('/superadmin/addManualMarket', data, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                    .then(response => {
                        if (response.data.success) {
                            alertify.success(response.data.message);
                            setSubmitting(false);
                            resetForm({
                                min: '',
                                max: '',
                                adv_max: '',
                                name: '',
                                password: ''
                            }
                            )
                            props.hideModal();
                        }
                        else {
                            setSubmitting(false);
                            setErrors({
                                password: <p style={{ color: 'red' }}>Invalid Password</p>
                            })
                        }

                    })
                    .catch(error => {
                        setSubmitting(false);
                        alert(error);
                        console.log(error);
                    })
            }
            }
            initialValues={{
                min: '100',
                max: '500000',
                adv_max: '25000',
                name: '',
                password: ''
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
            }) => (
                <Paper>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            margin: '10px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                        <h4>Add market to event {props.eventId}</h4>
                        <hr />
                        <FormControl
                            style={{
                                margin: '20px 0'
                            }}>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={handleChange} />
                            {touched.name && errors.name}
                        </FormControl>
                        <FormControl
                            style={{
                                margin: '20px 0 0'
                            }}>
                            <InputLabel htmlFor="min">Minimum</InputLabel>
                            <Input
                                id="min"
                                type="number"
                                name="min"
                                value={values.min}
                                onChange={handleChange}
                            />
                            {touched.min && errors.min}
                        </FormControl>
                        <FormControl
                            style={{
                                margin: '20px 0 0'
                            }}>
                            <InputLabel htmlFor="adv_max">Advance Maximum</InputLabel>
                            <Input
                                id="adv_max"
                                type="number"
                                name="adv_max"
                                value={values.adv_max}
                                onChange={handleChange}
                            />
                            {touched.adv_max && errors.adv_max}
                        </FormControl>
                        <FormControl
                            style={{
                                margin: '20px 0 0'
                            }}>
                            <InputLabel htmlFor="max">Maximum</InputLabel>
                            <Input
                                id="max"
                                type="number"
                                name="max"
                                value={values.max}
                                onChange={handleChange}
                            />
                            {touched.max && errors.max}
                        </FormControl>
                        <FormControl
                            style={{
                                margin: '20px 0 0'
                            }}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                            />
                            {touched.password && errors.password}
                        </FormControl>
                        <Button
                            type="submit"
                            variant='contained'
                            disabled={isSubmitting}
                            style={{
                                width: '100px',
                                margin: '10px 0'
                            }}
                        >Submit</Button>
                    </form>
                </Paper>
            )}
        </Formik>
    );
}

export default ChangePassword;