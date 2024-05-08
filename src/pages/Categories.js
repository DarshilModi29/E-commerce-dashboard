import React, { useCallback, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useFormik } from 'formik'
import { createCat } from '../schemas'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component';

const limit = 4;

const initVal = {
  catName: "",
  catStatus: "",
}

const host = "http://localhost:5000";

export default function Categories() {

  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const [cat, setCat] = useState([]);
  const [catId, setCatId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [totalCat, setTotalCat] = useState(0);
  const [loader, setLoader] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [hashmorevar, setHashmorevar] = useState(true);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setValues } = useFormik({
    initialValues: initVal,
    validationSchema: createCat,
    onSubmit: async (values, action) => {
      try {
        if (catId) {
          setLoader(true)
          const response = await fetch(`${host}/updateCategory?id=${catId}`, {
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
            setCatId(null);
            if (offset == 0) {
              loadData();
            }
            setCat([]);
            setOffset(0);
            document.getElementsByClassName("close")[0].click();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: responseData.message
            })
          }
          setLoader(false);;
        } else {
          setLoader(true);
          const response = await fetch(`${host}/createCategory`, {
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
            })
            if (offset == 0) {
              loadData();
            }
            setCat([]);
            setOffset(0);
            action.resetForm();
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
  });

  const deleteCat = async (id) => {
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
          const response = await fetch(`${host}/category/${id}`, {
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
            setOffset(0);
            setCat([]);
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
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `${erorr}`
      });
    }
  }

  const getData = async (categoryId) => {
    const response = await fetch(`${host}/category?id=${categoryId}`, {
      headers: {
        'authorization': `${authToken}`
      }
    });
    const data = await response.json();
    setValues({
      catName: data.data.name,
      catStatus: data.data.status
    });
    setCatId(data.data._id);
  }

  const loadData = useCallback(() => {
    setHashmorevar(true);
    fetch(`${host}/getCategory?limit=${limit}&offset=${offset}&search=${searchString}`, {
      headers: {
        'authorization': `${authToken}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setCat(searchString ? data.data : (prev) => [...prev, ...data.data]);
          setHashmorevar(false);
          setTotalCat(data.total);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [authToken, limit, offset, setCat, setTotalCat, searchString]);

  useEffect(() => {
    loadData();
    if (!authToken) {
      navigate("/login")
    }
  }, [navigate, authToken, limit, offset, loadData, searchString]);

  return (
    <>
      <Navbar breadCrumbLink={`/categories`} breadCrumbItem={`Category`} />
      <Sidebar />

      {
        loader ? <Loader /> : null
      }

      <div className="modal fade" id="categoryModal" tabIndex={-1} role="dialog" aria-labelledby="categoryModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="categoryModalLabel">Modal title</h5>
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
                          <label htmlFor="catName">Name</label>
                          <input type="text" name="catName" id="catName" className="form-control" placeholder="Name"
                            value={values.catName} onChange={handleChange} onBlur={handleBlur}
                          />
                          {
                            errors.catName && touched.catName ? (
                              <p className='form-error'>{errors.catName}</p>
                            ) : null
                          }
                        </div>
                        <div className="mb-3">
                          <label htmlFor="catStatus">Status</label>
                          <select name="catStatus" id="catStatus" className="form-control"
                            value={values.catStatus} onChange={handleChange} onBlur={handleBlur}>
                            <option value="">Select Status</option>
                            <option value="0">Active</option>
                            <option value="1">Inactive</option>
                          </select>
                          {
                            errors.catStatus && touched.catStatus ? (
                              <p className='form-error'>{errors.catStatus}</p>
                            ) : null
                          }
                        </div>
                      </div>
                    </div>
                    <div className="pb-5 pt-3">
                      <button className="btn btn-primary" type="submit">
                        {catId ? 'Update' : 'Create'}
                      </button>
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
                <h1>Categories</h1>
              </div>
              <div className="col-sm-6 text-right">
                <button type='button' className="btn btn-primary"
                  onClick={() => {
                    setValues(initVal);
                    setCatId(null);
                  }}
                  data-toggle="modal" data-target="#categoryModal">New Category</button>
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
                        if (e.target.value === '') {
                          setOffset(0);
                          setCat([]);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body table-responsive p-0">
                <InfiniteScroll
                  dataLength={cat.length}
                  next={(() => setOffset((prev) => prev + limit))}
                  hasMore={cat.length < totalCat}
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
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        cat?.map((i, k) => {
                          return (
                            <tr key={i._id}>
                              <td>{k + 1}</td>
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
                                <button type='button' className="btn btn-primary div-center edit-button" onClick={() => getData(i._id)} data-toggle="modal" data-target="#categoryModal">
                                  <svg className="filament-link-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button type='button' className="btn btn-danger div-center del-page mt-1" onClick={() => deleteCat(i._id)}>
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
        </section >
        {/* /.content */}
      </div >

      <Footer />
    </>
  )
}
