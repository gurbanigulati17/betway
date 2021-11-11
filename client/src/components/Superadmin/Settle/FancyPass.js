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
    pass: yup.number(),
    void: yup.boolean()
});

const FancyPass = (props) => {

    return (<Formik
        validationSchema={schema}
        onSubmit={(data, { setErrors, resetForm, setSubmitting }) => {
            setSubmitting(true);
            if (data.void) {
                const payload = {
                    event: props.eventId,
                    runner: props.runnerId,
                    password: data.password,
                    runnerName: props.runnerName,
                    type: 'fancy'
                }
                axios.put('/superadmin/voidFancy', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                    .then(response => {
                        if (response.data.success) {
                            alertify.success(response.data.message);
                            setSubmitting(false);
                            props.hideModal()
                            props.getFancyEvents()
                            resetForm({
                                password: '',
                                pass: '',
                                void: false
                            })
                        }
                        else {
                            setSubmitting(false);
                            setErrors({ password: <p style={{ color: 'red' }}>{response.data.message}</p> });
                        }

                    })
                    .catch(error => {
                        alert(error)
                        console.log(error);
                        props.hideModal()
                        resetForm({
                            password: '',
                            pass: '',
                            void: false
                        })
                    })
            } else {
                if (data.pass !== '') {
                    const payload = {
                        event: props.eventId,
                        runner: props.runnerId,
                        eventName: props.eventName,
                        runnerName: props.runnerName,
                        pass: data.pass,
                        password: data.password,
                        type: 'fancy'
                    }
                    axios.put('/superadmin/settleFancy', payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                        .then(response => {
                            if (response.data.success) {
                                alertify.success(response.data.message);
                                setSubmitting(false);
                                props.hideModal()
                                props.getFancyEvents()
                                resetForm({
                                    password: '',
                                    pass: '',
                                    void: false
                                })
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
                                pass: '',
                                void: false
                            })
                        })
                }
                else {
                    setSubmitting(false);
                    setErrors({ pass: <p style={{ color: 'red' }}>Pass required</p> });
                    return
                }

            }
        }
        }
        initialValues={{
            password: '',
            pass: '',
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
            return (<form onSubmit={handleSubmit}>
                <FormControl
                    style={{
                        display: 'block'
                    }}>
                    <input
                        id="void"
                        type="checkbox"
                        name="void"
                        value={values.void}
                        onChange={handleChange}
                    />
                    <label htmlFor='void'>void</label>
                    {touched.void && errors.void}
                </FormControl>
                <FormControl style={{ display: values.void ? 'none' : 'block' }}>
                    <InputLabel htmlFor="pass">Pass</InputLabel>
                    <Input
                        type="number"
                        name="pass"
                        placeholder="Enter run"
                        value={values.pass}
                        onChange={handleChange}
                    />
                    {touched.pass && errors.pass}
                </FormControl>
                <FormControl
                    style={{
                        display: 'block'
                    }}>
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
    </Formik>)
}
export default FancyPass;