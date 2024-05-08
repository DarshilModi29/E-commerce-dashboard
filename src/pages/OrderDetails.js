import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'

export default function OrderDetails() {
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");
    useEffect(() => {
        if (!authToken) {
            navigate("/login")
        }
    }, [navigate, authToken]);

    return (
        <>
            <Navbar breadCrumbLink={`/orderDetails`} breadCrumbItem={`OrderDetails`} />
            <Sidebar />

            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid my-2">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Order: #4F3S8J</h1>
                            </div>
                            <div className="col-sm-6 text-right">
                                <Link to="/orders" className="btn btn-primary">Back</Link>
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
                            <div className="col-md-9">
                                <div className="card">
                                    <div className="card-header pt-3">
                                        <div className="row invoice-info">
                                            <div className="col-sm-4 invoice-col">
                                                <h1 className="h5 mb-3">Shipping Address</h1>
                                                <address>
                                                    <strong>Mohit Singh</strong><br />
                                                    795 Folsom Ave, Suite 600<br />
                                                    San Francisco, CA 94107<br />
                                                    Phone: (804) 123-5432<br />
                                                    Email: info@example.com
                                                </address>
                                            </div>
                                            <div className="col-sm-4 invoice-col">
                                                <b>Invoice #007612</b><br />
                                                <br />
                                                <b>Order ID:</b> 4F3S8J<br />
                                                <b>Total:</b> $90.40<br />
                                                <b>Status:</b> <span className="text-success">Delivered</span>
                                                <br />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body table-responsive p-3">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th width={100}>Price</th>
                                                    <th width={100}>Qty</th>
                                                    <th width={100}>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Call of Duty</td>
                                                    <td>$10.00</td>
                                                    <td>2</td>
                                                    <td>$20.00</td>
                                                </tr>
                                                <tr>
                                                    <td>Call of Duty</td>
                                                    <td>$10.00</td>
                                                    <td>2</td>
                                                    <td>$20.00</td>
                                                </tr>
                                                <tr>
                                                    <td>Call of Duty</td>
                                                    <td>$10.00</td>
                                                    <td>2</td>
                                                    <td>$20.00</td>
                                                </tr>
                                                <tr>
                                                    <td>Call of Duty</td>
                                                    <td>$10.00</td>
                                                    <td>2</td>
                                                    <td>$20.00</td>
                                                </tr>
                                                <tr>
                                                    <th colSpan={3} className="text-right">Subtotal:</th>
                                                    <td>$80.00</td>
                                                </tr>
                                                <tr>
                                                    <th colSpan={3} className="text-right">Shipping:</th>
                                                    <td>$5.00</td>
                                                </tr>
                                                <tr>
                                                    <th colSpan={3} className="text-right">Grand Total:</th>
                                                    <td>$85.00</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h2 className="h4 mb-3">Order Status</h2>
                                        <div className="mb-3">
                                            <select name="status" id="status" className="form-control">
                                                <option value>Pending</option>
                                                <option value>Shipped</option>
                                                <option value>Delivered</option>
                                                <option value>Cancelled</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-primary">Update</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <h2 className="h4 mb-3">Send Inovice Email</h2>
                                        <div className="mb-3">
                                            <select name="status" id="status" className="form-control">
                                                <option value>Customer</option>
                                                <option value>Admin</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-primary">Send</button>
                                        </div>
                                    </div>
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
