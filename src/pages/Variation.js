import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useFormik } from 'formik'
import Footer from '../components/Footer'
import { varSchema } from '../schemas'
import Swal from 'sweetalert2'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'

const host = "http://localhost:5000";
const initVal = {
    var_name: ""
}
const limit = 4;

export default function Variation() {
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");

    const [varId, setVarId] = useState("");
    const [varType, setVarType] = useState([]);
    const [variationValues, setVariationValues] = useState(['']);
    const [offset, setOffset] = useState(0);
    const [searchString, setSearchString] = useState("");
    const [totalVar, setTotalVar] = useState(0);
    const [hashmorevar, setHashmorevar] = useState(true);

    const handleOnChange = (index, event) => {
        const values = [...variationValues];
        values[index] = event.target.value;
        setVariationValues(values);
    }

    const addField = () => {
        setVariationValues([...variationValues, '']);
    }

    let removeFormFields = (i) => {
        const values = [...variationValues];
        values.splice(i, 1);
        setVariationValues(values);
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: initVal,
        validationSchema: varSchema,
        onSubmit: async (values, action) => {
            try {
                if (varId) {
                    const varData = {
                        var_name: values.var_name,
                        var_values: variationValues
                    }
                    const response = await fetch(`${host}/updateVariation?id=${varId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json", 'authorization': `${authToken}`
                        },
                        body: JSON.stringify(varData),
                    });
                    const responseData = await response.json();
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: responseData.message
                        })
                        loadData();
                        setVarId(null);
                        document.getElementsByClassName("close")[0].click();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: responseData.message
                        });
                    }
                }
                else {
                    let varData = {
                        var_name: values.var_name,
                        var_values: variationValues
                    }
                    const response = await fetch(`${host}/createVariation`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", 'authorization': `${authToken}` },
                        body: JSON.stringify(varData),
                    });
                    const responseData = await response.json();
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: responseData.message
                        })
                        loadData();
                        action.resetForm();
                        setVariationValues(['']);
                        document.getElementsByClassName("close")[0].click();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: responseData.message
                        });
                    }
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: `${error}`
                });
                console.log(error);
            }
        }
    });

    const loadData = useCallback(() => {
        setHashmorevar(true);
        fetch(`${host}/getVariation?limit=${limit}&offset=${offset}&search=${searchString}`, {
            method: "GET",
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    setHashmorevar(false);
                    setVarType(searchString ? data.data : (prev) => [...prev, ...data.data]);
                    setTotalVar(data.total);
                }
            })
            .catch((err) => {
                console.log(err.toString());
            })
    }, [limit, offset, searchString, authToken])

    const getData = (id) => {
        fetch(`${host}/variation?id=${id}`, {
            method: "GET",
            headers: {
                'authorization': `${authToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setValues({
                    var_name: data.data.name
                });
                const values = [];
                for (let i = 0; i < data.data.var_values.length; i++) {
                    values.push(data.data.var_values[i]);
                }
                setVariationValues(values);
                setVarId(data.data._id)
                console.log(data.data._id);
            })
            .catch((err) => console.log(err.toString()));
    }

    const deleteData = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#3085d6",
                confirmButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await fetch(`${host}/variation/${id}`, {
                        method: "DELETE",
                        headers: {
                            'authorization': `${authToken}`
                        }
                    });
                    const responseData = await response.json();
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: responseData.message
                        });
                        loadData();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: responseData.message
                        });
                    }
                }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.toString()
            })
        }
    }

    useEffect(() => {
        loadData();
        if (!authToken) {
            navigate("/login")
        }
    }, [navigate, loadData, authToken])

    return (
        <div>
            <Navbar breadCrumbLink={`/variation`} breadCrumbItem={`Variation`} />
            <Sidebar />
            <div className="modal fade" id='variationModal' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="var_name">Variation Name</label>
                                    <input type="text" className='form-control' onChange={handleChange} onBlur={handleBlur} value={values.var_name} name="var_name" id="var_name" placeholder='Variaiton Name' />
                                </div>
                                {
                                    errors.var_name && touched.var_name ? (
                                        <p className='form-error'>{errors.var_name}</p>
                                    ) : null
                                }
                                <div className="mb-3">
                                    <button type='button' className="btn btn-primary" onClick={addField}>Add</button><br />
                                    <label htmlFor="var_values">Variation Values</label>
                                    {
                                        variationValues.map((value, index) => (
                                            <div className="row" key={index}>
                                                <div className="col-10">
                                                    <input type="text" className='form-control mb-2' onChange={(event) => handleOnChange(index, event)} value={value} placeholder='Variation Value' />
                                                </div>
                                                <div className="col-2">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => removeFormFields(index)}><i className="bi bi-x-lg"></i></button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    {
                                        varId ? "Update" : "Create"
                                    }
                                </button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div >
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid my-2">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Variations</h1>
                            </div>
                            <div className="col-sm-6 text-right">
                                <button type='button' className="btn btn-primary"
                                    data-toggle="modal" data-target="#variationModal"
                                    onClick={() => {
                                        setValues(initVal);
                                        setVariationValues(['']);
                                        setVarId(null);
                                    }}
                                >New Variation</button>
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
                                                    setVarType([]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body table-responsive p-0">
                                <InfiniteScroll
                                    dataLength={varType.length}
                                    next={() => setOffset(prev => prev + limit)}
                                    hasMore={varType.length < totalVar}
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
                                                <th>Name</th>
                                                <th>Values</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                varType?.map((i, k) => {
                                                    return (
                                                        <tr key={i._id}>
                                                            <td>{k + 1}</td>
                                                            <td>{i.name}</td>
                                                            <td>
                                                                {
                                                                    i.var_values.map((val, index) => {
                                                                        return (
                                                                            <p key={index}>{val}</p>
                                                                        )
                                                                    })
                                                                }
                                                            </td>
                                                            <td className='d-flex align-items-center'>
                                                                <button type='button' className="btn btn-primary div-center edit-button" onClick={() => getData(i._id)} data-toggle="modal" data-target="#variationModal">
                                                                    <svg className="filament-link-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                    </svg>
                                                                </button>
                                                                <button type='button' className="btn btn-danger div-center del-page ml-1" onClick={() => deleteData(i._id)}>
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
        </div >
    )
}
