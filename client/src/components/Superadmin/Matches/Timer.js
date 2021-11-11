import React from 'react';
import { FormControl, Button, Input, InputLabel, Paper } from '@material-ui/core';
import axios from '../../../axios-instance/backendAPI';
import { Formik } from 'formik';
import * as yup from 'yup';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const schema = yup.object({
    timer: yup.number()
        .min(0, <p style={{ color: 'red' }}>Timer can't be negative</p>)
        .max(60, <p style={{ color: 'red' }}>Timer greater than a minute</p>)
        .required(<p style={{ color: 'red' }}>Timer required</p>),
    admin_password: yup.string().required(<p style={{ color: 'red' }}>Admin Password required</p>)
});

const Timer = (props) => {

    return (
        <Formik
            validationSchema={schema}
            onSubmit={(data, { setErrors, resetForm, setSubmitting }) => {

                setSubmitting(true);
                const payload = {
                    timer: data.timer,
                    a_password: data.admin_password,
                    matchId: props.eventId
                }
                axios.put('/superadmin/setTimer', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                    .then(response => {

                        setSubmitting(false)
                        if (response.data.success) {
                            alertify.success(response.data.message);
                            props.hideModal()
                            props.getMatches()
                            resetForm({
                                timer: '',
                                admin_password: ''
                            }
                            )
                        }
                        else {
                            setErrors({
                                admin_password: <span style={{ color: 'red' }}>{response.data.message}</span>
                            })
                        }

                    })
                    .catch(error => {
                        setSubmitting(false);
                        resetForm({
                            timer: '',
                            admin_password: ''
                        }
                        )
                        console.log(error);
                    });

            }
            }
            initialValues={{
                timer: '',
                admin_password: ''
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
                        <FormControl
                            style={{
                                margin: '20px 0'
                            }}>
                            <InputLabel htmlFor="timer">Timer(in sec)</InputLabel>
                            <Input
                                id="timer"
                                type="number"
                                name="timer"
                                value={values.timer}
                                onChange={handleChange}
                            />
                            {touched.timer && errors.timer}
                        </FormControl>
                        <FormControl
                            style={{
                                margin: '20px 0'
                            }}>
                            <InputLabel htmlFor="password">Superadmin Password</InputLabel>
                            <Input
                                id="password"
                                type="password"
                                name="admin_password"
                                value={values.admin_password}
                                onChange={handleChange}
                            />
                            {touched.admin_password && errors.admin_password}
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

export default Timer