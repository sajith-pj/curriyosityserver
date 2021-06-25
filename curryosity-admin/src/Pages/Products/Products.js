import React, { useEffect } from 'react'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import './Product.css'
 axios.defaults.withCredentials = true
export default function Products() {

  const [errMsg, setErrMsg] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [products, setProducts] = useState([])
  const history = useHistory()
  const location = useLocation()

  const ValidityCheck = () => {
    axios.get('/admin/products', { withCredentials: true }).then(response => {
      if (response.data["loggedIn"] === false) {
        history.push('/admin/')
      } 
        setProducts(response.data)
      
      
    })
  }

  useEffect(() => {
    ValidityCheck()                                
    if (location.success === true) {
      setErrMsg(true)
      setTimeout(() => {
        setErrMsg(false)
      }, 3000)
    }
  }, [])


  const editProduct = (productId) => {

    console.log(productId);
    history.push({ pathname: '/admin/edit-product', id: productId })
  }

  const deleteProduct = (productId) => {
    axios.get('/admin/delete-product', { params: { proId: productId } }, { withCredentials: true }).then(response => {
      if (response.data.deleted === true) {
        ValidityCheck()
        setDeleted(true)
        setTimeout(() => {
          setDeleted(false)
        }, 3000)
      }
    })
  }

  return (
    <div className="container">
      {errMsg ?
        <div className="row">
          <div className="col-12">
            <div class="alert alert-success alert-dismissible fade show" role="alert">
              <strong> Product Added</strong>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setErrMsg(false)} ></button>
            </div>
          </div>
        </div>
        : null}
      {deleted ?
        <div className="row">
          <div className="col-12">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
              <strong> Product Deleted</strong>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                onClick={() => {
                  setDeleted(false)
                }} ></button>
            </div>
          </div>
        </div>
        : null}
      <div className="row mt-5">
        <div className="col-12 d-flex " >
          <Link to='/admin/add-products' className="btn btn-success ms-auto"> Add Products </Link>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Sl.No</th>
                <th scope="col"> </th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr className="table-row">
                  <th scope="row">{index + 1}</th>
                  <td><img className="product-preview" src={` data:{{` + product.contentType + `}};base64,` + product.base64} alt=" " /></td>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td><button className="btn btn-primary" onClick={() => {
                    editProduct(product._id)
                  }}  > Edit </button></td>
                  <td><button className="btn btn-danger" onClick={() => {
                    var r = window.confirm("Are You Want To Delete  " +product.productName);
                    if (r) {
                      deleteProduct(product._id)
                    }
                  }}
                  > Delete </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
