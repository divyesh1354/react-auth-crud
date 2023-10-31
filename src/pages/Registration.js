import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function Registration () {
    const navigate = useNavigate();
    const [apiErrors, setApiErrors] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
        password: Yup.string().transform(x => x === '' ? undefined : x)
            .concat(Yup.string().required('Password is required'))
            .min(8, 'Password must be at least 8 characters'),
        confirmPassword: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .when('password', (password, schema) => {
                if (password) return schema.required('Confirm Password is required');
            })
            .oneOf([Yup.ref('password')], 'Passwords must match'),
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data) => {
        data = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password,
            phone_no: data.phone_no,
        }
        setIsSaving(true);
        axios.post('http://localhost:8000/api/v1/register', data)
          .then(function (response) {
            if (response.data.errors) {
                const errorMessages = Object.values(response.data.errors);
                setApiErrors(errorMessages);
                setIsSaving(false);
            } else {
                // Handle the successful response here
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate("/dashboard");
            }
            setIsSaving(false);
          })
          .catch(function (error) {
            setIsSaving(false);
            const errorMessages = Object.values(error.response.data.errors);
            setApiErrors(errorMessages);
          });
    }

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                            <div className="card-body p-4 p-sm-5">
                                <h5 className="card-title text-center mb-5 fw-light fs-5">Create new account</h5>
                                <form onSubmit={handleSubmit(onSubmit)} id="frmRegistration">
                                    {apiErrors.map((error, index) => (
                                        <div key={index} className="alert alert-danger">{error}</div>
                                    ))}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text" 
                                            {...register('firstName')}
                                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                            id="first_name"
                                            placeholder="Jhon"
                                        />
                                        <label htmlFor="first_name">First Name</label>
                                        <div className="invalid-feedback">{errors.firstName?.message}</div>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text" 
                                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                            id="last_name"
                                            placeholder="Joe"
                                            {...register('lastName')}
                                        />
                                        <label htmlFor="last_name">Last Name</label>
                                        <div className="invalid-feedback">{errors.lastName?.message}</div>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                        type="email" 
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                        id="floatingemail" 
                                        placeholder="name@example.com"
                                        {...register('email')}
                                        />
                                        <label htmlFor="floatingemail">Email address</label>
                                        <div className="invalid-feedback">{errors.email?.message}</div>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                        type="password" 
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                                        id="password" 
                                        placeholder="Password"
                                        {...register('password')}
                                        />
                                        <label htmlFor="password">Password</label>
                                        <div className="invalid-feedback">{errors.password?.message}</div>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                        type="password" 
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} 
                                        id="confirmPassword" 
                                        placeholder="confirmPassword"
                                        {...register('confirmPassword')}
                                        />
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                        type="text" 
                                        className={`form-control ${errors.phone_no ? 'is-invalid' : ''}`} 
                                        id="phone_no" 
                                        placeholder="phone_no"
                                        {...register('phone_no')}
                                        />
                                        <label htmlFor="phone_no">Phone No</label>
                                        <div className="invalid-feedback">{errors.phone_no?.message}</div>
                                    </div>

                                    <div className="d-grid">
                                        <input 
                                        disabled={isSaving}
                                        type="submit"
                                        className="btn btn-primary btn-login text-uppercase fw-bold"
                                        value="Sign Up"
                                        />
                                    </div>
                                    <hr className="my-4"></hr>

                                    <div className="d-grid">
                                        <Link className="btn btn-outline-primary btn-login text-uppercase fw-bold" to="/">Log in</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Registration;