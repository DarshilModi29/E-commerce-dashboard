import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
    return (
        <>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                <Link to="/" className="brand-link">
                    <img src="img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">KRM SHOP</span>
                </Link>
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Sidebar user (optional) */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {/* Add icons to the links using the .nav-icon class
								with font-awesome or any other icon font library */}
                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>Dashboard</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/categories" className="nav-link">
                                    <i className="nav-icon fas fa-file-alt" />
                                    <p>Category</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/subcategory" className="nav-link">
                                    <i className="nav-icon fas fa-file-alt" />
                                    <p>Sub Category</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/brands" className="nav-link">
                                    <svg className="h-6 nav-icon w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p>Brands</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/variation" className="nav-link">
                                    <i className="bi bi-card-list nav-icon ml-1 mr-2"></i>
                                    <p>Variation</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/products" className="nav-link">
                                    <i className="nav-icon fas fa-tag" />
                                    <p>Products</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/orders" className="nav-link">
                                    <i className="nav-icon fas fa-shopping-bag" />
                                    <p>Orders</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/users" className="nav-link">
                                    <i className="nav-icon  fas fa-users" />
                                    <p>Users</p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    {/* /.sidebar-menu */}
                </div>
                {/* /.sidebar */}
            </aside>
        </>
    )
}
