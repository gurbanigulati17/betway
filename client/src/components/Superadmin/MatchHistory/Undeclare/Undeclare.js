import React from 'react';
import { FormControl, Button, InputLabel, Input } from '@material-ui/core';
import axios from '../../../../axios-instance/backendAPI';
import { Formik } from 'formik';
import * as yup from 'yup';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const schema = yup.object({

    password: yup.string()
        .required(<p style={{ color: 'red' }}>Password required</p>),

});

const Undeclare = (props) => {

    return (
        <Formik
            validationSchema={schema}
            onSubmit={(data, { setErrors, resetForm, setSubmitting }) => {

                setSubmitting(true);
                const payload = {
                    eventId: props.eventId,
                    marketId: props.marketId,
                    type: props.type,
                    password: data.password,
                }
                let url
                if (props.type === 'fancy') {
                    payload.runnerName = props.name
                    url = '/superadmin/undeclareFancy'
                }
                else {
                    url = '/superadmin/undeclareMatch'
                }

                axios.put(url, payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                    .then(response => {
                        if (response.data.success) {
                            resetForm({
                                password: ''
                            })
                            setSubmitting(false);
                            props.hideModal()
                            props.handleUpdate()
                            alertify.success(response.data.message);
                        }
                        else {
                            setErrors({ password: <p style={{ color: 'red' }}>{response.data.message}</p> });
                            setSubmitting(false);
                        }

                    })
                    .catch(err => {
                        setSubmitting(false);
                        console.log(err);
                    })
            }
            }
            initialValues={{
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
                <form noValidate onSubmit={handleSubmit}>
                    <h4>Are u sure u want to undeclare {props.event}/{props.name}?</h4>
                    <FormControl>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                        />
                        {touched.password && errors.password}
                    </FormControl>
                    <br />
                    <Button
                        type="submit"
                        variant='contained'
                        disabled={isSubmitting}
                        style={{
                            margin: '5px 0'
                        }}>Submit</Button>
                </form>
            )}
        </Formik>
    );
}

export default Undeclare;