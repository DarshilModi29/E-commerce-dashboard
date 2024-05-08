import React, { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { subCatSchema } from '../schemas'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component';

const limit = 4;

const initVal = {
    catName: "",
    subCatName: "",
    subCatDesc: "",
    subCatStatus: ""
}
const host = "http://localhost:5000";

export default function SubCategories() {

    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");

    const [subCat, setSubCat] = useState([]);
    const [cat, setCat] = useState([]);
    const [subCatId, setSubCatId] = useState(null);
    const [offset, setOffset] = useState(0);
    const [totalSubCat, setTotalSubCat] = useState(0);
    const [loader, setLoader] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [hasmorevar, setHasmorevar] = useState(false)

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initVal,
        validationSchema: subCatSchema,
        onSubmit: async (values, action) => {
            try {
                if (subCatId) {
                    setLoader(true);
                    const response = await fetch(`${host}/updateSubCategory?id=${subCatId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json", 'authorization': `${authToken}` },
                        body: JSON.stringify(values),
                    });
                    const responseData = await response.json();
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: responseData.message
                        })
                        if (offset == 0) {
                            loadData();
                        }
                        setSubCat([]);
                        setOffset(0);
                        setSubCatId(null);
                        document.getElementsByClassName("close")[0].click();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: responseData.message
                        })
                    }
                    setLoader(false);
                } else {
                    setLoader(true);
                    const response = await fetch(`${host}/createSubCategory`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", 'authorization': `${authToken}` },
                        body: JSON.stringify(values),
                    });;
                    const responseData = await response.json();
                    console.log(responseData.body);
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: responseData.message
                        })
                        if (offset == 0) {
                            loadData();
                        }
                        setSubCat([]);
                        setOffset(0);
                        action.resetForm();
                        document.getElementsByClassName("close")[0].click();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: responseData.message
                        })
                    }
                    setLoader(false);
                }
            } catch (erorr) {
                setLoader(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: `${erorr}`
                });
            }
        }
    });

    const deleteSubCat = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoader(true);
                    const response = await fetch(`${host}/subCategory/${id}`, {
                        method: "DELETE",
                        headers: {
                            'authorization': `${authToken}`
                        }
                    });
                    const catData = await response.json();
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: catData.message
                        });
                        if (offset == 0) {
                            loadData();
                        }
                        setSubCat([]);
                        setOffset(0);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: catData.message
                        })
                    }
                    setLoader(false);
                }
            });
        } catch (erorr) {
            setLoader(false);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: `${erorr}`
            });
        }
    }

    const getData = async (subCategoryId) => {
        const response = await fetch(`${host}/subCategory?id=${subCategoryId}`, {
            headers: {
                'authorization': `${authToken}`
            }
        });
        const data = await response.json();
        setValues({
            catName: data.data.catName,
            subCatName: data.data.name,
            subCatDesc: data.data.description,
            subCatStatus: data.data.status
        });
        setSubCatId(data.data._id);
    }

    const loadData = useCallback(() => {
        setHasmorevar(true);
        fetch(`${host}/getSubCategory?limit=${limit}&offset=${offset}&search=${searchString}`, {
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    setHasmorevar(false);
                    setSubCat(searchString ? data.data : (prev) => [...prev, ...data.data]);
                    setTotalSubCat(data.total);
                }
            }).catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [authToken, offset, setSubCat, setTotalSubCat, limit, searchString]);

    const loadCatData = useCallback(() => {
        fetch(`${host}/getCategory`, {
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setCat(data.data);
            });
    }, [authToken]);

    useEffect(() => {
        loadData();
        loadCatData();
        if (!authToken) {
            navigate("/login")
        }
    }, [navigate, loadData, loadCatData, authToken, offset]);

    return (
        <>
            <Navbar breadCrumbLink={`/subcategory`} breadCrumbItem={`Sub Category`} />
            <Sidebar />

            {loader ? <Loader /> : null}

            <div className="modal fade" id="subCategoryModal" tabIndex={-1} role="dialog" aria-labelledby="subCategoryModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="subCategoryModalLabel">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Main content */}
                            <section className="content">
                                {/* Default box */}
                                <div className="container-fluid">
                                    <form onSubmit={handleSubmit}>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <label htmlFor="catName">Category</label>
                                                    <select name="catName" id="catName" className="form-control"
                                                        onChange={handleChange} onBlur={handleBlur} value={values.catName}
                                                    >
                                                        <option value="">Select One</option>
                                                        {
                                                            cat?.map((i) => {
                                                                return (
                                                                    <option key={i._id} value={i._id}>{i.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        errors.catName && touched.catName ? (
                                                            <p className='form-error'>{errors.catName}</p>
                                                        ) : null
                                                    }
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="subCatName">Name</label>
                                                    <input type="text" name="subCatName" id="subCatName" className="form-control" placeholder="Name"
                                                        value={values.subCatName} onChange={handleChange} onBlur={handleBlur}
                                                    />
                                                    {
                                                        errors.subCatName && touched.subCatName ? (
                                                            <p className='form-error'>{errors.subCatName}</p>
                                                        ) : null
                                                    }
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="subCatDesc">Description</label>
                                                    <textarea type="text" name="subCatDesc" id="subCatDesc" className="summernote form-control" placeholder="Description"
                                                        value={values.subCatDesc} onChange={handleChange} onBlur={handleBlur}>

                                                    </textarea>
                                                    {
                                                        errors.subCatDesc && touched.subCatDesc ? (
                                                            <p className='form-error'>{errors.subCatDesc}</p>
                                                        ) : null
                                                    }
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="subCatStatus">Status</label>
                                                    <select name="subCatStatus" id="subCatStatus" className="form-control"
                                                        value={values.subCatStatus} onChange={handleChange} onBlur={handleBlur}>
                                                        <option value="">Select Status</option>
                                                        <option value="0">Active</option>
                                                        <option value="1">Inactive</option>
                                                    </select>
                                                    {
                                                        errors.subCatStatus && touched.subCatStatus ? (
                                                            <p className='form-error'>{errors.subCatStatus}</p>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pb-5 pt-3">
                                            <button className="btn btn-primary">{subCatId ? 'Update' : 'Create'}</button>
                                        </div>
                                    </form>
                                </div>
                                {/* /.card */}
                            </section>

                            {/* /.content */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid my-2">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Sub Category</h1>
                            </div>
                            <div className="col-sm-6 text-right">
                                <button type='button' className="btn btn-primary" data-toggle="modal" data-target="#subCategoryModal" onClick={() => {
                                    setValues(initVal);
                                    setSubCatId(null);
                                }}>New Sub Category</button>
                            </div>
                        </div>
                    </div>
                    {/* /.container-fluid */}
                </section>
                {/* Main content */}
                <section className="content">
                    {/* Default box */}
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-tools">
                                    <div className="input-group input-group" style={{ width: 250 }}>
                                        <input type="text" name="table_search" className="form-control float-right" placeholder="Search" value={searchString}
                                            onChange={(e) => {
                                                setSearchString(e.target.value);
                                                if (e.target.value === "") {
                                                    setOffset(0);
                                                    setSubCat([]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body table-responsive p-0">
                                <InfiniteScroll
                                    dataLength={subCat.length}
                                    next={() => setOffset(prev => prev + limit)}
                                    hasMore={subCat.length < totalSubCat}
                                    loader={
                                        hasmorevar ?
                                            <div className="my-2 d-flex justify-content-center">
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div> : null
                                    }>
                                    <table className="table table-hover text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Category</th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                subCat?.map((i, k) => {
                                                    return (
                                                        <tr key={i._id}>
                                                            <td>{k + 1}</td>
                                                            <td>{i.subCatData[0] && i.subCatData[0].name ? i.subCatData[0].name : "Unknown"}</td>
                                                            <td>{i.name}</td>
                                                            <td>{i.description}</td>
                                                            <td>
                                                                {
                                                                    i.status === 0 ?
                                                                        <svg className="text-success-500 h-6 w-6 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg> :
                                                                        <svg className="text-danger h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                }
                                                            </td>
                                                            <td>
                                                                <button type='button' className="btn btn-primary div-center edit-page" data-toggle="modal" onClick={() => getData(i._id)} data-target="#subCategoryModal">
                                                                    <svg className="filament-link-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                    </svg>
                                                                </button>
                                                                <button type='button' onClick={() => deleteSubCat(i._id)} className="btn btn-danger div-center del-page mt-1">
                                                                    <svg className="filament-link-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </InfiniteScroll>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    )
}
