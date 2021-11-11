import React from 'react';
import {
    FormControl,
    InputLabel,
    Input,
    Button
} from "@material-ui/core"
import axios from '../../../../axios-instance/backendAPI';
import { Formik } from 'formik';
import * as yup from 'yup';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const schema = yup.object({
    password: yup.string()
        .required(<p style={{ color: 'red' }}>Password required</p>),
    delete: yup.boolean(),
    code: yup.string()
});

const VoidBet = (props) => {
    return (
        <Formik
            validationSchema={schema}
            onSubmit={(data, { setErrors, resetForm, setSubmitting }) => {

                setSubmitting(true);
                let url = '/superadmin/deleteBets', payload

                if (!data.delete) {
                    url = '/superadmin/voidBets'
                } else if (data.code !== 'jethalal') {
                    setErrors({
                        code: <p style={{ color: 'red' }}>Incorrect code</p>
                    })
                    setSubmitting(false)
                    return
                }

                payload = {
                    bets: props.bets,
                    password: data.password,
                }

                axios.put(url, payload, { headers: { Authorization: 'Bearer ' + localStorage.getItem('a_token') } })
                    .then(response => {
                        if (response.data.success) {
                            alertify.success(response.data.message);
                            setSubmitting(false);
                            resetForm({
                                password: ''
                            }
                            )
                            props.hideModal();
                            props.updateRows()
                            props.clearSelected()
                        }
                        else {
                            setSubmitting(false);
                            setErrors({
                                password: <p style={{ color: 'red' }}>{response.data.message}</p>
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
                <form onSubmit={handleSubmit} style={{ margin: '5px' }}>
                    <h3>Enter password to void following bets {props.bets.map(bet => bet + ',')}</h3>
                    <hr />
                    <FormControl
                        style={{ display: 'block' }}>
                        <input
                            id="delete"
                            type="checkbox"
                            name="delete"
                            value={values.delete}
                            defaultChecked={false}
                            onChange={handleChange}
                        />
                        <label htmlFor='delete'>X</label>
                        {touched.void && errors.void}
                    </FormControl>
                    <FormControl style={{ display: !values.delete ? 'none' : 'block' }}>
                        <InputLabel htmlFor="pass">Enter code</InputLabel>
                        <Input
                            type="password"
                            name="code"
                            value={values.code}
                            onChange={handleChange}
                        />
                        {touched.code && errors.code}
                    </FormControl>
                    <FormControl>
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
                    <br />
                    <Button
                        type="submit"
                        variant='contained'
                        disabled={isSubmitting}
                        style={{ margin: '10px 0' }}
                    >Submit</Button>
                </form>
            )}
        </Formik>
    );
}

export default VoidBet;