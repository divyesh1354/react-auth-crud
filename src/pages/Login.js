import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function Login () {
    const navigate = useNavigate();
    const [apiErrors, setApiErrors] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('user') && localStorage.getItem('user') != null) {
            navigate("/dashboard");
        }
    }, [])

    // form validation rules 
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Email is invalid').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data) => {
        data = {
            email: data.email,
            password: data.password,
        }
        setIsSaving(true);
        axios.post('http://localhost:8000/api/v1/login', data)
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
            console.log(error);
            const errorMessages = Object.values(error.response.data);
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
                                <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
                                <form onSubmit={handleSubmit(onSubmit)} id="frmLogin">
                                    {apiErrors.map((error, index) => (
                                        <div key={index} className="alert alert-danger">{error}</div>
                                    ))}
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

                                    <div className="d-grid">
                                        <input
                                            disabled={isSaving}
                                            type="submit"
                                            className="btn btn-primary btn-login text-uppercase fw-bold"
                                            value="Sign in"
                                        />
                                    </div>
                                    <hr className="my-4"></hr>

                                    <div className="d-grid">
                                        <Link className="btn btn-outline-primary btn-login text-uppercase fw-bold" to="/signup">Create new account </Link>
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

export default Login;