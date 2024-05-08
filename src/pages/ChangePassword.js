import React from 'react'
import { useFormik } from 'formik'
import Swal from 'sweetalert2';
import { changepassSchema } from '../schemas';

let initVal = {
    user_email: "",
    old_pass: "",
    new_pass: ""
}

let host = "http://localhost:5000";

export default function ChangePassword() {
    const authToken = localStorage.getItem("authToken");

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initVal,
        validationSchema: changepassSchema,
        onSubmit: async (values, action) => {
            try {
                console.log(values);
                const response = await fetch(`${host}/changePassword`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", 'authorization': `${authToken}` },
                    body: JSON.stringify(values),
                });
                console.log(response);
                const responseData = await response.json();
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: responseData.message
                    });
                    action.resetForm();
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

    return (
        <div>
            <div className="outer-login-box" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div className="login-box">
                    {/* /.login-logo */}
                    <div className="card card-outline card-primary">
                        <div className="card-header text-center">
                            <a href="#" className="h3">Change Password Panel</a>
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
                                    <input type="password" className="form-control" name='old_pass' placeholder="Old Password" onChange={handleChange} onBlur={handleBlur} value={values.old_pass} />
                                    {
                                        errors.old_pass && touched.old_pass ? (
                                            <p className='form-error'>{errors.old_pass}</p>
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
