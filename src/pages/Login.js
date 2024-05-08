import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import { loginSchema } from '../schemas/index'
import { Link, useNavigate } from 'react-router-dom'

let initVal = {
    userEmail: "",
    userPass: ""
}

let host = "http://localhost:5000";

export default function Login() {

    let navigate = useNavigate();

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initVal,
        validationSchema: loginSchema,
        onSubmit: async (values, action) => {
            try {
                console.log(values);
                const response = await fetch(`${host}/loginUser`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                console.log(response);
                const responseData = await response.json();
                if (response.ok) {
                    action.resetForm();
                    localStorage.setItem("authToken", responseData.authToken);
                    navigate("/");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: responseData.message
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: `${error.toString()}`
                });
            }
        }
    });

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            navigate("/");
        }
    }, [navigate])

    return (
        <>
            <div className="outer-login-box" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div className="login-box">
                    {/* /.login-logo */}
                    <div className="card card-outline card-primary">
                        <div className="card-header text-center">
                            <a href="#" className="h3">Administrative Panel</a>
                        </div>
                        <div className="card-body">
                            <p className="login-box-msg">Sign in to start your session</p>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb-3">
                                    <input type="email" className="form-control" name='userEmail' placeholder="Email" onChange={handleChange} onBlur={handleBlur} value={values.userEmail} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="password" className="form-control" name='userPass' placeholder="Password" onChange={handleChange} onBlur={handleBlur} value={values.userPass} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {/* /.col */}
                                    <div className="col-4">
                                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                                    </div>
                                    {/* /.col */}
                                </div>
                            </form>
                            <p className="mb-1 mt-3">
                                <Link to="/forgotpassword">I forgot my password</Link>
                            </p>
                        </div>
                        {/* /.card-body */}
                    </div>
                    {/* /.card */}
                </div>
            </div>
        </>
    )
}
