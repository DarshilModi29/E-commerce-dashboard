import React, { useCallback, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Image from '../components/Image'
import Loader from '../components/Loader'
import { useFormik } from 'formik'
import { brandSchema } from '../schemas'
import { checkIfFileIsCorrectType } from '../schemas'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import InfiniteScroll from 'react-infinite-scroll-component';

const limit = 4;

const initVal = {
    catName: "",
    subCatName: "",
    brandName: "",
    brandLogo: "",
    brandStatus: "",
}

const host = "http://localhost:5000";

export default function Brands() {

    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");

    const [files, setFiles] = useState([]);
    const [brandLogoError, setBrandLogoError] = useState("");
    const [brandId, setBrandId] = useState(null);
    const [brand, setBrand] = useState([]);
    const [cat, setCat] = useState([]);
    const [subCat, setSubCat] = useState([]);
    const [offset, setOffset] = useState(0);
    const [totalBrand, setTotalBrand] = useState(0);
    const [loader, setLoader] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [hashmorevar, setHashmorevar] = useState(true);

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initVal,
        validationSchema: brandSchema,
        onSubmit: async (values, action) => {
            if (files.length === 0) {
                setBrandLogoError("Please select a Logo");
            } else {
                try {
                    for (let i = 0; i < files.length; i++) {
                        if (!checkIfFileIsCorrectType(files[i])) {
                            setBrandLogoError("Invalid file type. Allowed types: JPG, JPEG, PNG.")
                            return;
                        }
                    }
                    if (!brandId) {
                        const formData = new FormData();
                        formData.append("catName", values.catName);
                        formData.append("subCatName", values.subCatName);
                        formData.append("brandName", values.brandName);
                        formData.append("brandLogo", files[0]);
                        formData.append("brandStatus", values.brandStatus);
                        setLoader(true);
                        const response = await fetch(`${host}/createBrand`, {
                            method: "POST",
                            headers: {
                                'authorization': `${authToken}`
                            },
                            body: formData
                        });
                        const responseData = await response.json();
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: responseData.message
                            });
                            if (offset === 0) {
                                loadData();
                            }
                            setBrand([]);
                            setOffset(0);
                            action.resetForm();
                            setFiles([]);
                            document.getElementById("brandCreate").click();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: responseData.message
                            });
                        }
                        setLoader(false);
                    } else {
                        const formData = new FormData();
                        formData.append("catName", values.catName);
                        formData.append("subCatName", values.subCatName);
                        formData.append("brandName", values.brandName);
                        formData.append("brandLogo", files[0]);
                        formData.append("brandStatus", values.brandStatus);
                        setLoader(true);
                        const response = await fetch(`${host}/updateBrand?id=${brandId}`, {
                            method: "PATCH",
                            headers: {
                                'authorization': `${authToken}`
                            },
                            body: formData,
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
                            setBrand([]);
                            setOffset(0);
                            setBrandId(null);
                            document.getElementsByClassName("close")[0].click();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: responseData.message
                            });
                        }
                        setLoader(false);
                    }
                } catch (error) {
                    setLoader(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: `${error}`
                    });
                }
            }
        }
    });

    const getData = async (id) => {
        const response = await fetch(`${host}/brand?id=${id}`, {
            headers: {
                'authorization': `${authToken}`
            }
        });
        const data = await response.json();
        await fetchCatData(data.data.catName);
        const image = `${host}/${data.data.image}`;
        const fileExt = image.split('.').pop().toLowerCase();
        setValues({
            catName: data.data.catName,
            subCatName: data.data.subCatName,
            brandName: data.data.name,
            brandStatus: data.data.status
        });
        setFiles(
            [{
                preview: image,
                type: `image/${fileExt}`
            }]
        );
        setBrandId(data.data._id);
    }

    const deleteBrand = async (id) => {
        try {
            console.log(id);
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
                    const response = await fetch(`${host}/brand/${id}`, {
                        method: "DELETE",
                        headers: {
                            'authorization': `${authToken}`
                        }
                    });
                    const responseData = await response.json();
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: responseData.message
                        });
                        if (offset === 0) {
                            loadData();
                        }
                        setBrand([]);
                        setOffset(0);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: responseData.message
                        });
                    }
                    setLoader(false);
                }
            });
        }
        catch (error) {
            setLoader(false);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.toString()
            });
        }
    }

    const fetchCatData = async (catId) => {
        await fetch(`http://localhost:5000/subCat/brand?catId=${catId}`, {
            method: "GET",
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setSubCat(data.data);
                console.log(data);
            })
            .catch((error) => {
                console.log(error.toString());
            })
    };

    const loadData = useCallback(() => {
        setHashmorevar(true);
        fetch(`${host}/getBrand?limit=${limit}&offset=${offset}&search=${searchString}`, {
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    setHashmorevar(false);
                    setBrand(searchString ? data.data : (prev) => [...prev, ...data.data]);
                    setTotalBrand(data.total);
                }
            });
    }, [authToken, offset, setBrand, setTotalBrand, searchString]);

    const catData = useCallback(() => {
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
        catData();
        if (!authToken) {
            navigate("/login");
        }
    }, [navigate, authToken, catData, loadData, offset]);

    return (
        <>
            <Navbar breadCrumbLink={`/brands`} breadCrumbItem={`Brands`} />
            <Sidebar />

            {loader ? <Loader /> : null}

            <div className="modal fade" id="brandModal" tabIndex={-1} role="dialog" aria-labelledby="brandModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="brandModalLabel">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Main content */}
                            <section className="content">
                                {/* Default box */}
                                <div className="container-fluid">
                                    <form onSubmit={handleSubmit} encType='multipart/form-data'>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <label htmlFor="catName">Category</label>
                                                    <select name="catName" id="catName" className="form-control"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            fetchCatData(e.target.value);
                                                            console.log(e.target.value);
                                                        }
                                                        }
                                                        onBlur={handleBlur} value={values.catName}
                                                    >
                                                        <option value="">Select One</option>
                                                        {
                                                            cat?.map((i, k) => {
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
                                                    <label htmlFor="subCatName">Sub Category</label>
                                                    <select name="subCatName" id="subCatName" className="form-control"
                                                        onChange={handleChange} onBlur={handleBlur} value={values.subCatName}
                                                    >
                                                        <option value="">Select One</option>
                                                        {
                                                            subCat?.map((i, k) => {
                                                                return (
                                                                    <option key={i._id} value={i._id}>{i.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        errors.subCatName && touched.subCatName ? (
                                                            <p className='form-error'>{errors.subCatName}</p>
                                                        ) : null
                                                    }
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="brandName">Name</label>
                                                    <input type="text" name="brandName" id="brandName" className="form-control" placeholder="Name"
                                                        value={values.brandName} onChange={handleChange} onBlur={handleBlur}
                                                    />
                                                    {
                                                        errors.brandName && touched.brandName ? (
                                                            <p className='form-error'>{errors.brandName}</p>
                                                        ) : null
                                                    }
                                                </div>

                                                <Image
                                                    handleChange={handleChange}
                                                    handleBlur={handleBlur}
                                                    label={"Logo"}
                                                    files={files}
                                                    setFiles={setFiles}
                                                    name={"brandLogo"}
                                                    id={"brandLogo"}
                                                />
                                                <p className="form-error">{brandLogoError}</p>

                                                <div className="mb-3">
                                                    <label htmlFor="brandStatus">Status</label>
                                                    <select name="brandStatus" id="brandStatus" className="form-control"
                                                        value={values.brandStatus} onChange={handleChange} onBlur={handleBlur}>
                                                        <option value="">Select Status</option>
                                                        <option value="0">Active</option>
                                                        <option value="1">Inactive</option>
                                                    </select>
                                                    {
                                                        errors.brandStatus && touched.brandStatus ? (
                                                            <p className='form-error'>{errors.brandStatus}</p>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pb-5 pt-3">
                                            <button className="btn btn-primary" type='submit'>{brandId ? 'Update' : 'Create'}</button>
                                        </div>
                                    </form>
                                </div>
                                {/* /.card */}
                            </section>
                            {/* /.content */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" id='brandCreate' data-dismiss="modal">Close</button>
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
                                <h1>Brands</h1>
                            </div>
                            <div className="col-sm-6 text-right">
                                <button type='button' className="btn btn-primary" data-toggle="modal" data-target="#brandModal"
                                    onClick={() => {
                                        setValues(initVal);
                                        setFiles([]);
                                    }}>New Brand</button>
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
                                                    setBrand([]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body table-responsive p-0">
                                <InfiniteScroll
                                    dataLength={brand.length}
                                    next={() => setOffset(prev => prev + limit)}
                                    hasMore={brand.length < totalBrand}
                                    loader={
                                        hashmorevar ?
                                            <div className="my-2 d-flex justify-content-center">
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div> : null
                                    }>
                                    <table className="table table-hover text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>S. No.</th>
                                                <th>Logo</th>
                                                <th>Category</th>
                                                <th>Sub Category</th>
                                                <th>Name</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                brand?.map((i, k) => {
                                                    return (
                                                        <tr key={i._id}>
                                                            <td>{k + 1}</td>
                                                            <td><img src={`${host}/${i.image}`} alt={i.name} width={100} height={100} className='rounded-circle' /></td>
                                                            <td>{i.catData[0] && i.catData[0].name ? i.catData[0].name : "Unknown"}</td>
                                                            <td>{i.subCatData[0] && i.subCatData[0].name ? i.subCatData[0].name : "Unknown"}</td>
                                                            <td>{i.name}</td>
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
                                                                <button type='button' className="btn btn-primary div-center edit-page" onClick={() => getData(i._id)} data-toggle="modal" data-target="#brandModal">
                                                                    <svg className="filament-link-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                    </svg>
                                                                </button>
                                                                <button type='button' className="btn btn-danger div-center del-page mt-1" onClick={() => deleteBrand(i._id)}>
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
                    {/* /.card */}
                </section>
                {/* /.content */}
            </div>
            <Footer />
        </>
    )
}
