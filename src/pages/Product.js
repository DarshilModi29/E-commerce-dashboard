import React, { useState, useEffect, useCallback } from 'react'
import Image from '../components/Image'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { useFormik } from 'formik'
import { productSchema } from '../schemas'
import Swal from 'sweetalert2'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../components/Loader';
const limit = 4;

const initVal = {
    catName: "",
    subCatName: "",
    brandName: "",
    pro_name: "",
}

const initVal2 = {
    price: "",
    compare_price: "",
    qty: "",
    pro_status: "",
    variation_type: "",
}

const host = "http://localhost:5000";

export default function Product() {
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");

    const [desc, setDesc] = useState("");
    const [proId, setProId] = useState("");
    const [smallDesc, setSmallDesc] = useState("");
    const [files, setFiles] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const [cat, setCat] = useState([]);
    const [subCat, setSubCat] = useState([]);
    const [brand, setBrand] = useState([]);
    const [product, setProduct] = useState([]);
    const [variation, setVariation] = useState([]);
    const [proDetails, setProDetails] = useState([]);
    const [proDetailsId, setProDetailsId] = useState([]);
    const [varType, setVarType] = useState('');
    const [varVal, setVarVal] = useState({});
    const [offset, setOffset] = useState(0);
    const [message, setMessage] = useState("");
    const [fileError, setFileError] = useState("");
    const [totalProducts, setTotalProducts] = useState(0);
    const [loader, setLoader] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [hashmorevar, setHashmorevar] = useState(true);
    const [variantVal, setVariantVal] = useState([]);

    const handleDescChange = (content) => {
        setDesc(content);
    };

    const handleSmallDescChange = (content) => {
        setSmallDesc(content);
    };

    const mainDetails = useFormik({
        initialValues: initVal,
        validationSchema: productSchema,
        onSubmit: async (values, action) => {
            try {
                if (!thumbnail) {
                    setMessage("Please select an thumbnail");
                    return;
                } else {
                    if (proId) {
                        const formData = new FormData();
                        formData.append("catName", values.catName);
                        formData.append("subCatName", values.subCatName);
                        formData.append("brandName", values.brandName);
                        formData.append("pro_name", values.pro_name);
                        formData.append("pro_desc", desc);
                        formData.append("pro_small_desc", smallDesc);
                        formData.append("pro_thumbnail", thumbnail[0]);
                        setLoader(true);
                        const response = await fetch(`${host}/updateProduct?id=${proId}`, {
                            method: "PATCH",
                            body: formData,
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
                            setProduct([]);
                            setMessage("");
                            setOffset(0);
                            setProId(null)
                            document.getElementById("productModal").click();
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
                        formData.append("pro_name", values.pro_name);
                        formData.append("pro_desc", desc);
                        formData.append("pro_small_desc", smallDesc);
                        formData.append("pro_thumbnail", thumbnail[0]);
                        setLoader(true);
                        const response = await fetch(`${host}/createProduct`, {
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
                            setProduct([]);
                            setOffset(0);
                            action.resetForm();
                            setThumbnail([]);
                            setMessage("");
                            setDesc("");
                            setSmallDesc("");
                            document.getElementById("productModal").click();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: responseData.message
                            });
                        }
                        setLoader(false);
                    }
                }
            } catch (error) {
                setLoader(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error.toString()
                });
            }
        }
    });

    const productDetailsData = async (id) => {
        try {
            const response = await fetch(`${host}/productDetails?id=${id}`, {
                method: "GET",
                headers: {
                    'authorization': `${authToken}`
                },
            });
            const responseData = await response.json();
            let images = responseData.data.image
            coreDetails.setValues({
                price: responseData.data.price,
                compare_price: responseData.data.compare_price ? responseData.data.compare_price : 0,
                qty: responseData.data.qty,
                pro_status: responseData.data.status,
            });
            setVarType(responseData.data.varType !== null ? responseData.data.varType : '');
            setProDetailsId(responseData.data._id);
            setVariantVal(responseData.data.varVal != null ? responseData.data.varVal : []);
            const allImages = images?.map(image => ({
                preview: `${host}/${image}`
            }));
            setFiles(allImages);
        } catch (error) {
            console.log(error);
        }
    }

    const coreDetails = useFormik({
        initialValues: initVal2,
        onSubmit: async (values, action) => {
            try {
                if (!files) {
                    setFileError("Please select product images");
                    return;
                } else {
                    if (proDetailsId) {
                        const formData = new FormData();
                        formData.append("product_id", proId);
                        formData.append("price", values.price);
                        formData.append("compare_price", values.compare_price);
                        formData.append("qty", values.qty);
                        formData.append("variationType", varType);
                        variantVal && variantVal.forEach((item) => {
                            formData.append("variationValue", item);
                        });
                        formData.append("pro_status", values.pro_status);
                        files.forEach((image) => {
                            formData.append("pro_image", image);
                        })
                        setLoader(true);
                        const response = await fetch(`${host}/updateProductDetails?id=${proDetailsId}`, {
                            method: "PATCH",
                            body: formData,
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
                            fetchProductDetails(proId);
                            setFileError("");
                            action.resetForm();
                            setFiles([]);
                            setProDetailsId(null);
                            setVariantVal([]);
                            setVarType('');
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
                        formData.append("product_id", proId);
                        formData.append("price", values.price);
                        formData.append("compare_price", values.compare_price);
                        formData.append("qty", values.qty);
                        formData.append("variationType", varType);
                        variantVal && variantVal.forEach((item) => {
                            formData.append("variationValue", item);
                        });
                        formData.append("pro_status", values.pro_status);
                        files.forEach((image) => {
                            formData.append("pro_image", image);
                        })
                        setLoader(true);
                        const response = await fetch(`${host}/createProductDetails`, {
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
                            fetchProductDetails(proId);
                            coreDetails.setValues(initVal2);
                            setFileError("");
                            action.resetForm();
                            setFiles([]);
                            setVariantVal([]);
                            setVarType('');
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: responseData.message
                            });
                        }
                        setLoader(false);
                    }
                }
            } catch (error) {
                setLoader(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error.toString()
                });
            }
        }
    });

    const deleteProductDetails = async (id) => {
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
                    const response = await fetch(`${host}/productDetails/${id}`, {
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
                        })
                        fetchProductDetails(proId);
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

    const productData = async (id) => {
        try {
            const response = await fetch(`${host}/product?id=${id}`, {
                method: "GET",
                headers: {
                    'authorization': `${authToken}`
                }
            });
            const responseData = await response.json();
            await fetchCatData(responseData.data.catName);
            await fetchBrand(responseData.data.subCatName);
            mainDetails.setValues({
                catName: responseData.data.catName,
                subCatName: responseData.data.subCatName,
                brandName: responseData.data.brandName,
                pro_name: responseData.data.name,
            });
            setProId(responseData.data._id);
            setDesc(responseData.data.desc);
            setSmallDesc(responseData.data.smallDesc);
            setThumbnail([{ preview: `${host}/${responseData.data.thumbnail}` }])
        } catch (error) {
            console.log(error);
        }
    }

    const changeField = async (operation, id) => {
        try {
            setLoader(true);
            const response = await fetch(`${host}/product/qty?operation=${operation}&id=${id}`, {
                method: "PATCH",
                headers: {
                    'authorization': `${authToken}`
                }
            });
            if (!response.ok) {
                const respData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: respData.message
                });
            }
            setLoader(false);
            fetchProductDetails(proId);
        } catch (error) {
            setLoader(false);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.toString()
            });
        }
    }

    const getVariation = useCallback(() => {
        fetch(`${host}/getVariation`, {
            method: "GET",
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setVariation(data.data);
                let obj = {};
                for (let i = 0; i < data.data.length; i++) {
                    obj[`${data.data[i]._id}`] = data.data[i].var_values;
                }
                setVarVal(obj);
            })
            .catch((err) => console.log(err.toString()));
    }, [authToken, setVariation, setVarVal]);

    const deleteProduct = async (id) => {
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
                    setLoader(true)
                    const response = await fetch(`${host}/product/${id}`, {
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
                        })
                        if (offset === 0) {
                            loadData();
                        }
                        setProduct([]);
                        setOffset(0);
                        setLoader(false);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: responseData.message
                        });
                        setLoader(false);
                    }
                }
            });
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.toString()
            });
            setLoader(false);
        }
    }

    const clearData = () => {
        mainDetails.setValues(initVal);
        setProId(null);
        setThumbnail([]);
        setDesc("");
        setSmallDesc("");
    }

    const fetchProductDetails = (id) => {
        fetch(`${host}/getProductDetails?id=${id}`, {
            method: "GET",
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => [
                setProDetails(data.data)
            ])
            .catch(err => console.log(err));
    }

    const loadData = useCallback(() => {
        setHashmorevar(true);
        fetch(`${host}/getProduct?limit=${limit}&offset=${offset}&search=${searchString}`, {
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    setHashmorevar(false);
                    setProduct(searchString ? data.data : (prev) => [...prev, ...data.data]);
                    setTotalProducts(data.total);
                }
            });
    }, [authToken, offset, setProduct, setTotalProducts, searchString]);

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
    }, [authToken, setCat]);

    const fetchBrand = async (subCatId) => {
        await fetch(`http://localhost:5000/brand/product?subCatId=${subCatId}`, {
            method: "GET",
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setBrand(data.data);
            })
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
            })
            .catch((error) => {
                console.log(error.toString());
            })
    };

    useEffect(() => {
        catData();
        loadData();
        getVariation();
        if (!authToken) {
            navigate("/login")
        }
    }, [navigate, catData, loadData, getVariation, authToken, offset]);

    return (
        <>
            <Navbar breadCrumbLink={`/products`} breadCrumbItem={`Products`} />
            <Sidebar />

            {
                loader ? <Loader /> : null
            }


            <div className="modal fade" id="productModal" tabIndex={-1} role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="productModalLabel">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Main content */}
                            <section className="content">
                                {/* Default box */}
                                <div className="container-fluid">
                                    <form encType='multipart/form-data' onSubmit={(e) => {
                                        e.preventDefault();
                                        mainDetails.handleSubmit();
                                    }}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card mb-3">
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <label htmlFor="catName">Category Name</label>
                                                            <select name="catName" id="catName" className="form-control" value={mainDetails.values.catName}
                                                                onChange={(e) => {
                                                                    mainDetails.handleChange(e);
                                                                    fetchCatData(e.target.value);
                                                                }} onBlur={mainDetails.handleBlur}>
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
                                                                mainDetails.errors.catName && mainDetails.touched.catName ? (
                                                                    <p className='form-error'>{mainDetails.errors.catName}</p>
                                                                ) : null
                                                            }
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="subCatName">Subcategory Name</label>
                                                            <select name="subCatName" id="subCatName" className="form-control" value={mainDetails.values.subCatName}
                                                                onChange={(e) => {
                                                                    mainDetails.handleChange(e);
                                                                    fetchBrand(e.target.value);
                                                                }} onBlur={mainDetails.handleBlur}>
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
                                                                mainDetails.errors.subCatName && mainDetails.touched.subCatName ? (
                                                                    <p className='form-error'>{mainDetails.errors.subCatName}</p>
                                                                ) : null
                                                            }
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="brandName">Brand Name:</label>
                                                            <select name="brandName" id="brandName" value={mainDetails.values.brandName} className="form-control" onChange={mainDetails.handleChange} onBlur={mainDetails.handleBlur}>
                                                                <option value="">Select One</option>
                                                                {
                                                                    brand?.map((i, k) => {
                                                                        return (
                                                                            <option key={i._id} value={i._id}>{i.name}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                            {
                                                                mainDetails.errors.brandName && mainDetails.touched.brandName ? (
                                                                    <p className='form-error'>{mainDetails.errors.brandName}</p>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card mb-3">
                                                    <div className="card-body">
                                                        <Image
                                                            handleChange={mainDetails.handleChange}
                                                            handleBlur={mainDetails.handleBlur}
                                                            label={"Thumbnail"}
                                                            files={thumbnail}
                                                            setFiles={setThumbnail}
                                                            name={"pro_thumbnail"}
                                                            id={"pro_thumbnail"}
                                                        />
                                                        <div className="mb-3">
                                                            <label htmlFor="pro_name">Product Name</label>
                                                            <input name="pro_name" placeholder='Product Name' value={mainDetails.values.pro_name} id='pro_name' type="text" className="form-control" onChange={mainDetails.handleChange} onBlur={mainDetails.handleBlur} />
                                                            {
                                                                message ? (
                                                                    <p className='form-error'>{message}</p>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card mb-3">
                                                    <div className="card-body">
                                                        <h2 className='h4 mb-3'>Thumbnail</h2>
                                                        <div className="mb-3">
                                                            <label htmlFor="pro_desc">Description</label>
                                                            <ReactQuill modules={{
                                                                toolbar: [
                                                                    [{ header: [1, 2, false] }],
                                                                    ['bold', 'italic', 'underline'],
                                                                    ['image', 'code-block', 'link']
                                                                ]
                                                            }}
                                                                onChange={handleDescChange} value={desc} name="pro_desc" id='pro_desc' theme="snow" />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="pro_small_desc">Small Description</label>
                                                            <ReactQuill
                                                                modules={{
                                                                    toolbar: [
                                                                        [{ header: [1, 2, false] }],
                                                                        ['bold', 'italic', 'underline'],
                                                                        ['image', 'code-block', 'link']
                                                                    ]
                                                                }}
                                                                onChange={handleSmallDescChange} value={smallDesc} name="pro_small_desc" id='pro_small_desc' theme="snow" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pb-5 pt-3">
                                            <button type='submit' className="btn btn-primary">{proId ? 'Update' : 'Create'}</button>
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
                </div >
            </div >

            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid my-2">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Products</h1>
                            </div>
                            <div className="col-sm-6 text-right">
                                <button type='button' className="btn btn-primary" data-toggle="modal" data-target="#productModal" onClick={() => clearData()}>New Product</button>
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
                                                    setProduct([]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body table-responsive p-0">
                                <InfiniteScroll
                                    dataLength={product.length}
                                    next={() => setOffset(prev => prev + limit)}
                                    hasMore={product.length < totalProducts}
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
                                                <th>ID</th>
                                                <th>Thumbnail</th>
                                                <th>Category</th>
                                                <th>Sub Category</th>
                                                <th>Brand</th>
                                                <th>Product</th>
                                                <th style={{ width: "20%" }}>Description</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                product?.map((i, k) => {
                                                    var tempDiv = document.createElement('div');
                                                    tempDiv.innerHTML = i.desc;
                                                    var descWithoutTags = tempDiv.textContent || tempDiv.innerText;
                                                    return (
                                                        <tr key={i._id}>
                                                            <td>{k + 1}</td>
                                                            <td><img src={`${host}/${i.thumbnail}`} alt={i.name} className="img-thumbnail" width={60} height={60} /></td>
                                                            <td>{i.catData[0].name}</td>
                                                            <td>{i.subCatData[0].name}</td>
                                                            <td>{i.brandData[0].name}</td>
                                                            <td>{i.name}</td>
                                                            <td>{descWithoutTags}</td>
                                                            <td style={{ display: "flex", alignItems: "center" }}>
                                                                <button type='button' className="btn btn-primary div-center edit-page" onClick={() => productData(i._id)} data-toggle="modal" data-target="#productModal">
                                                                    <svg className="filament-link-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                    </svg>
                                                                </button>
                                                                <button type='button' className="btn btn-danger div-center del-page ml-1" onClick={() => deleteProduct(i._id)}>
                                                                    <svg className="filament-link-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                                <button type='button' className="btn btn-primary div-center ml-1" data-toggle="modal" data-target="#moreProductModal"
                                                                    onClick={() => {
                                                                        setProId(i._id);
                                                                        setProDetailsId(null);
                                                                        coreDetails.setValues(initVal2);
                                                                        setFiles([]);
                                                                        fetchProductDetails(i._id);
                                                                        setVariantVal([]);
                                                                        setVarType('');
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                                                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
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
                </section >
                {/* /.content */}
            </div >

            <div>
                <div className="modal fade" id="moreProductModal" tabIndex={-1} role="dialog" aria-labelledby="moreProductModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="moreProductModalLabel">Add Other Details</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form encType='multipart/form-data' className='mb-3' onSubmit={coreDetails.handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <Image
                                                        handleChange={coreDetails.handleChange}
                                                        handleBlur={coreDetails.handleBlur}
                                                        label={"Product Image"}
                                                        files={files}
                                                        setFiles={setFiles}
                                                        name={"pro_image"}
                                                        id={"pro_image"}
                                                    />
                                                    {
                                                        fileError ? (
                                                            <p className='form-error'>{fileError}</p>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h2 className="h4 mb-3">Pricing</h2>
                                                    <div className="mb-3">
                                                        <label htmlFor="price">Price</label>
                                                        <input type="text" name="price" id="price" value={coreDetails.values.price} className="form-control" placeholder="Price" onChange={coreDetails.handleChange} onBlur={coreDetails.handleBlur} />
                                                        {
                                                            coreDetails.errors.price && coreDetails.touched.price ? (
                                                                <p className='form-error'>{coreDetails.errors.price}</p>
                                                            ) : null
                                                        }
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="compare_price">Compare at Price</label>
                                                        <input type="text" name="compare_price" id="compare_price" value={coreDetails.values.compare_price} className="form-control" placeholder="Compare Price" onChange={coreDetails.handleChange} onBlur={coreDetails.handleBlur} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h2 className="h4 mb-3">Inventory</h2>
                                                    <div className="mb-3">
                                                        <div className="custom-control custom-checkbox">
                                                            <input className="custom-control-input" type="checkbox" id="track_qty" name="track_qty" defaultChecked />
                                                            <label htmlFor="track_qty" className="custom-control-label">Track Quantity</label>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <input type="number" min={0} name="qty" id="qty" value={coreDetails.values.qty} className="form-control" placeholder="Qty" onChange={coreDetails.handleChange} onBlur={coreDetails.handleBlur} />
                                                        {
                                                            coreDetails.errors.qty && coreDetails.touched.qty ? (
                                                                <p className='form-error'>{coreDetails.errors.qty}</p>
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h2 className="h4 mb-3">Product status</h2>
                                                    <div className="mb-3">
                                                        <label htmlFor="pro_status">Status</label>
                                                        <select name="pro_status" id="pro_status" value={coreDetails.values.pro_status} className="form-control" onChange={coreDetails.handleChange} onBlur={coreDetails.handleBlur}>
                                                            <option value="">Select Status</option>
                                                            <option value="0">Active</option>
                                                            <option value="1">Inactive</option>
                                                        </select>
                                                        {
                                                            coreDetails.errors.pro_status && coreDetails.touched.pro_status ? (
                                                                <p className='form-error'>{coreDetails.errors.pro_status}</p>
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h4 className='mb-3'>Variation</h4>
                                                    <div>
                                                        <div className="mb-3">
                                                            <label htmlFor={`variation_type`}>Variation Type</label>
                                                            <select
                                                                name={`variation_type`}
                                                                id={`variation_type`}
                                                                className='form-control'
                                                                value={varType}
                                                                onChange={(e) => {
                                                                    setVarType(e.target.value);
                                                                }}
                                                            >
                                                                <option value="">Select One</option>
                                                                {
                                                                    variation?.map((v, k) => {
                                                                        return (
                                                                            <option key={v._id} value={v._id}>{v.name}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor={`variation_values`}>Variation Values</label>
                                                            <select
                                                                multiple
                                                                name={`variation_values`}
                                                                id={`variation_values`}
                                                                className='form-control'
                                                                value={variantVal}
                                                                onChange={(e) => {
                                                                    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                                                                    setVariantVal(selectedOptions);
                                                                }}
                                                            >
                                                                <option value="">Select One</option>
                                                                {
                                                                    varType &&
                                                                    varVal[`${varType}`].map((v, i) => {
                                                                        return (
                                                                            <option key={i} value={v}>{v}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="mb-3 ml-2 btn btn-primary">{proDetailsId ? "Update" : "Create"}</button>
                                        {
                                            proDetails ?
                                                <div div className="mb-4 container-fluid">
                                                    <div className="card">
                                                        <div className="card-header">
                                                            <div className="card-tools">
                                                                <div className="input-group input-group" style={{ width: 250 }}>
                                                                    <input type="text" name="table_search" className="form-control float-right" placeholder="Search" />
                                                                    <div className="input-group-append">
                                                                        <button type="submit" className="btn btn-default">
                                                                            <i className="fas fa-search" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-body table-responsive p-0">
                                                            <table className="table table-hover text-nowrap">
                                                                <thead>
                                                                    <tr>
                                                                        <th>ID</th>
                                                                        <th>Price</th>
                                                                        <th>Compare Price</th>
                                                                        <th className='text-center'>Qty</th>
                                                                        <th>Variant Type</th>
                                                                        <th>Variant Value</th>
                                                                        <th>Status</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        proDetails?.map((v, i) => {
                                                                            return (
                                                                                <tr key={v._id}>
                                                                                    <td>{i + 1}</td>
                                                                                    <td>₹ {v.price}</td>
                                                                                    <td className='text-center'>₹ {v.compare_price ? v.compare_price : 0} </td>
                                                                                    <td className='d-flex align-items-center'>
                                                                                        <button type="button" onClick={() => changeField("sub", v._id)} className='btn-dark shadow-none rounded-circle d-flex align-items-center justify-content-center mr-1' style={{ height: '25px', width: '25px' }}>
                                                                                            <i className='bi bi-dash-lg'></i>
                                                                                        </button> {v.qty}
                                                                                        <button type="button" onClick={() => changeField("add", v._id)} className='ml-1 btn-dark shadow-none rounded-circle d-flex align-items-center justify-content-center' style={{ height: '25px', width: '25px' }}>
                                                                                            <i className='bi bi-plus-lg'></i>
                                                                                        </button>
                                                                                    </td>
                                                                                    <td>{v.VarByProducts.length > 0 ? v.VarByProducts[0].name : ""}</td>
                                                                                    <td>{v.varVal?.map((i, k) => {
                                                                                        return (
                                                                                            k + 1 === v.varVal.length ? i : i + ","
                                                                                        )
                                                                                    })}</td>
                                                                                    <td>
                                                                                        <div style={{ cursor: "pointer" }} onClick={() => changeField("changeStatus", v._id)}>
                                                                                            {
                                                                                                v.status === 0 ?
                                                                                                    <svg className="text-success-500 h-6 w-6 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                                    </svg> :
                                                                                                    <svg className="text-danger h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                                    </svg>
                                                                                            }
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className='d-flex align-items-center'>
                                                                                        <button type='button' className="btn btn-primary div-center edit-button" onClick={() => {
                                                                                            productDetailsData(v._id)
                                                                                        }}>
                                                                                            <svg className="filament-link-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                                            </svg>
                                                                                        </button>
                                                                                        <button type='button' className="btn btn-danger div-center del-page ml-1" onClick={() => deleteProductDetails(v._id)}>
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
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                ""
                                        }

                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <Footer />
        </>
    )
}
