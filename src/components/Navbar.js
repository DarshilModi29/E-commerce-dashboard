import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(props) {
    const navigate = useNavigate();
    return (
        <>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                {/* Right navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>
                </ul>
                <div className="navbar-nav pl-2">
                    <ol className="breadcrumb p-0 m-0 bg-white">
                        <li className="breadcrumb-item"><Link to={`${props.breadCrumbLink}`}>{props.breadCrumbItem}</Link></li>
                        <li className="breadcrumb-item active">List</li>
                    </ol>
                </div>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="fullscreen" href="#" role="button">
                            <i className="fas fa-expand-arrows-alt" />
                        </a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link p-0 pr-3" data-toggle="dropdown" href="#">
                            <img src="img/avatar5.png" className="img-circle elevation-2" width={40} height={40} />
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right p-3">
                            <h4 className="h4 mb-0"><strong>Mohit Singh</strong></h4>
                            <div className="mb-3">example@example.com</div>
                            <div className="dropdown-divider" />
                            <a href="#" className="dropdown-item">
                                <i className="fas fa-user-cog mr-2" /> Settings
                            </a>
                            <div className="dropdown-divider" />
                            <Link to="/changepassword" className="dropdown-item">
                                <i className="fas fa-lock mr-2" /> Change Password
                            </Link>
                            <div className="dropdown-divider" />
                            <button type='button' className="dropdown-item text-danger"
                                onClick={() => {
                                    localStorage.removeItem("authToken");
                                    navigate("/login");
                                }}
                            >
                                <i className="fas fa-sign-out-alt mr-2" /> Logout
                            </button>
                        </div>
                    </li>
                </ul>
            </nav >

        </>
    )
}