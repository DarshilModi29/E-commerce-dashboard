import React, { useState } from 'react'
import { useFormik } from 'formik'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { forgotPassSchema } from '../schemas';

let initVal = {
    user_email: "",
    new_pass: ""
}

let host = "http://localhost:5000";

export default function ForgotPassword() {

    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");

    const [confirmPass, setConfirmPass] = useState("");
    const [confirmPassError, setConfirmPassError] = useState("");

    const handleConfirmPassword = (e) => {
        if (e.target.value === "") {
            setConfirmPassError("Please enter your password again.");
            return;
        }
        setConfirmPass(e.target.value);
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initVal,
        validationSchema: forgotPassSchema,
        onSubmit: (values, action) => {
            try {
                if (confirmPass !== values.new_pass) {
                    setConfirmPassError("Passwords should be matched");
                    return;
                }
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "I am sure!"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const response = await fetch(`${host}/forgotpassword`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json", 'authorization': `${authToken}` },
                            body: JSON.stringify(values),
                        });
                        const responseData = await response.json();
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: responseData.message
                            });
                            action.resetForm();
                            navigate("/login");
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: responseData.message
                            });
                        }
                    }
                })
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: `${error.toString()}`
                });
            }
        }
    });

    return (
        <div>
            <div className="outer-login-box" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div className="login-box">
                    {/* /.login-logo */}
                    <div className="card card-outline card-primary">
                        <div className="card-header text-center">
                            <a href="#" className="h3">Forgot Password Panel</a>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className={`form-group`}>
                                    <input type="email" className="form-control" name='user_email' placeholder="Email" onChange={handleChange} onBlur={handleBlur} value={values.user_email} />
                                    {
                                        errors.user_email && touched.user_email ? (
                                            <p className='form-error'>{errors.user_email}</p>
                                        ) : null
                                    }
                                </div>
                                <div className={`form-group`}>
                                    <input type="password" className="form-control" name='new_pass' placeholder="New Password" onChange={handleChange} onBlur={handleBlur} value={values.new_pass} />
                                    {
                                        errors.new_pass && touched.new_pass ? (
                                            <p className='form-error'>{errors.new_pass}</p>
                                        ) : null
                                    }
                                </div>
                                <div className={`form-group`}>
                                    <input type="password" className="form-control" name='confirm_new_pass' placeholder="Confirm Password" onChange={handleConfirmPassword} value={confirmPass} />
                                    <p className='form-error'>{confirmPassError}</p>
                                </div>
                                <div className="row">
                                    {/* /.col */}
                                    <div className={`col-4 mt-1`}>
                                        <button type="submit" className="btn btn-primary btn-block">Change</button>
                                    </div>
                                    {/* /.col */}
                                </div>
                            </form>
                            <p className="mb-1 mt-3">
                            </p>
                        </div>
                        {/* /.card-body */}
                    </div>
                    {/* /.card */}
                </div>
            </div>
        </div>
    )
}
