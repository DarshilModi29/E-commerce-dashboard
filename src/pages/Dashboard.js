import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");

    useEffect(() => {
        if (!authToken) {
            navigate("/login")
        }
    }, [navigate, authToken]);
    return (
        <>
            <Navbar breadCrumbLink={`/`} breadCrumbItem={`Dashboard`} />
            <Sidebar />

            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Dashboard</h1>
                            </div>
                            <div className="col-sm-6">
                            </div>
                        </div>
                    </div>
                    {/* /.container-fluid */}
                </section>
                {/* Main content */}
                <section className="content">
                    {/* Default box */}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4 col-6">
                                <div className="small-box card">
                                    <div className="inner">
                                        <h3>150</h3>
                                        <p>Total Orders</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-bag" />
                                    </div>
                                    <a href="#" className="small-box-footer text-dark">More info <i className="fas fa-arrow-circle-right" /></a>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="small-box card">
                                    <div className="inner">
                                        <h3>50</h3>
                                        <p>Total Customers</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-stats-bars" />
                                    </div>
                                    <a href="#" className="small-box-footer text-dark">More info <i className="fas fa-arrow-circle-right" /></a>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="small-box card">
                                    <div className="inner">
                                        <h3>$1000</h3>
                                        <p>Total Sale</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-person-add" />
                                    </div>
                                    <a href="javascript:void(0);" className="small-box-footer">&nbsp;</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /.card */}
                </section>
                {/* /.content */}
            </div>

            <Footer />
        </>
    )
}
