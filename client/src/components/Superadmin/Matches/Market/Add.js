import React from 'react';
import { FormControl, Button, Input, InputLabel } from '@material-ui/core';
import axios from '../../../../axios-instance/backendAPI';
import { Formik } from 'formik';
import * as yup from 'yup';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const schema = yup.object({

    password: yup.string()
        .required(<p style={{ color: 'red' }}>New password required</p>),
    name: yup.string()
        .required(<p style={{ color: 'red' }}>Runner name required</p>),
    back: yup.number()
        .required(<p style={{ color: 'red' }}>Back value required</p>)
        .min(0, <p style={{ color: 'red' }}>Back must be greater than 0</p>)
        .max(99.99, <p style={{ color: 'red' }}>Back must be smaller than 99.99</p>),
    lay: yup.number()
        .required(<p style={{ color: 'red' }}>Lay value required</p>)
        .min(0, <p style={{ color: 'red' }}>Lay must be greater than 0</p>)
        .max(99.99, <p style={{ color: 'red' }}>Lay must be smaller than 99.99</p>),
});

const ChangePassword = (props) => {
    return (
        <Formik
            validationSchema={schema}
            onSubmit={(data, { setErrors, resetForm, setSubmitting }) => {

                setSubmitting(true);
                data.marketId = props.marketId
                data.eventId = props.eventId
                axios.post('/superadmin/addRunner', data, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                    .then(response => {
                        if (response.data.success) {
                            alertify.success(response.data.message);
                            setSubmitting(false);
                            resetForm({
                                back: '',
                                lay: '',
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
                back: '',
                lay: '',
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
                <form
                    onSubmit={handleSubmit}
                    style={{
                        margin: '10px 10px 0',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                    <h3>Add runner to market {props.marketId}</h3>
                    <hr/>
                    <FormControl>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                        />
                        {touched.name && errors.name}
                    </FormControl>
                    <FormControl
                        style={{
                            margin: '20px 0'
                        }}>
                        <InputLabel htmlFor="back">Back odds</InputLabel>
                        <Input
                            id="back"
                            type="number"
                            name="back"
                            value={values.back}
                            onChange={handleChange}
                        />
                        {touched.back && errors.back}
                    </FormControl>
                    <FormControl
                        style={{
                            margin: '20px 0'
                        }}>
                        <InputLabel htmlFor="lay">Lay odds</InputLabel>
                        <Input
                            id="lay"
                            type="number"
                            name="lay"
                            value={values.lay}
                            onChange={handleChange}
                        />
                        {touched.lay && errors.lay}
                    </FormControl>
                    <FormControl
                        style={{
                            margin: '20px 0'
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
                        }}>Submit</Button>
                </form>
            )}
        </Formik>
    );
}

export default ChangePassword;